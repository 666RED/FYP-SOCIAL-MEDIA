import { Folder } from "../models/folderModel.js";
import { Group } from "../models/groupModel.js";
import { Note } from "../models/noteModel.js";
import { uploadFile, deleteFile } from "../middleware/handleFile.js";
import {
	addNewNote,
	removeNoteNotification,
	removeNoteNotifications,
} from "../API/firestoreAPI.js";

export const createNewFolder = async (req, res) => {
	try {
		const { groupId, folderName } = req.body;

		const existingFolder = await Folder.findOne({
			name: folderName,
			groupId: groupId,
		});

		if (existingFolder) {
			return res.status(400).json({ msg: "Folder name is already in use" });
		}

		const newFolder = new Folder({
			name: folderName,
			groupId: groupId,
		});

		const savedFolder = await newFolder.save();

		if (!savedFolder) {
			return res.status(400).json({ msg: "Fail to create new folder" });
		}

		const numberOfNotes = await Note.countDocuments({
			folderId: savedFolder._id,
		});

		const returnedFolder = {
			...savedFolder._doc,
			numberOfNotes,
		};

		res.status(200).json({ msg: "Success", returnedFolder });
	} catch (err) {
		console.log(err);

		res.status(500).json({ error: err.message });
	}
};

export const retrieveFolders = async (req, res) => {
	try {
		const { groupId } = req.query;

		const folders = await Folder.find({ groupId: groupId })
			.select({
				createdAt: 0,
				updatedAt: 0,
				__v: 0,
			})
			.sort({ name: 1 })
			.exec();

		if (!folders) {
			return res.status(400).json({ msg: "Fail to retreive folders" });
		}

		const returnedFolders = await Promise.all(
			folders.map(async (folder) => {
				const numberOfNotes = await Note.countDocuments({
					folderId: folder._id,
				});
				return {
					...folder._doc,
					numberOfNotes,
				};
			})
		);

		res.status(200).json({ msg: "Success", returnedFolders });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

export const createNewNote = async (req, res) => {
	try {
		const { folderId, groupId } = req.body;

		const file = req.file;

		const fileURL = await uploadFile("note/", file);

		const newNote = new Note({
			filePath: fileURL,
			folderId: folderId,
			noteOriginalName: file.originalname,
		});

		const savedNote = await newNote.save();

		if (!savedNote) {
			return res.status(400).json({ msg: "Fail to upload new note" });
		}

		const returnedNote = {
			_id: savedNote._id,
			noteOriginalName: savedNote.noteOriginalName,
			filePath: savedNote.filePath,
			uploaded: new Date(savedNote.createdAt).toLocaleString(),
		};

		const group = await Group.findById(groupId);
		const groupAdminId = group.groupAdminId.toString();

		// firebase
		const memberIds = Array.from(group.members.keys())
			.filter((id) => id !== groupAdminId)
			.map((id) => id.toString());
		const groupName = group.groupName;

		await addNewNote({
			noteId: savedNote._id.toString(),
			groupAdminId,
			memberIds,
			groupName,
			folderId,
			groupId,
		});

		res.status(200).json({ msg: "Success", returnedNote });
	} catch (err) {
		console.log(err);

		res.status(500).json({ error: err.message });
	}
};

export const retrieveNotes = async (req, res) => {
	try {
		const { folderId } = req.query;

		const notes = await Note.find({ folderId: folderId });

		if (!notes) {
			return res.status(400).json({ msg: "Fail to retrieve notes" });
		}

		const returnedNotes = notes.map((note) => {
			return {
				_id: note._id,
				noteOriginalName: note.noteOriginalName,
				filePath: note.filePath,
				uploaded: new Date(note.createdAt).toLocaleString(),
			};
		});

		res.status(200).json({ msg: "Success", returnedNotes });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

export const removeNote = async (req, res) => {
	try {
		const { noteId, filePath, groupId } = req.body;

		// firebase
		const group = await Group.findById(groupId);
		const groupAdminId = group.groupAdminId.toString();
		const memberIds = Array.from(group.members.keys())
			.filter((id) => id !== groupAdminId)
			.map((id) => id.toString());
		await removeNoteNotification({ noteId, memberIds });

		const deletedNote = await Note.findByIdAndDelete(noteId);

		if (!deletedNote) {
			return res.status(400).json({ msg: "Fail to remove note" });
		}

		// delete note file
		await deleteFile(filePath);

		res.status(200).json({ msg: "Success", noteId });
	} catch (err) {
		console.log(err);

		res.status(500).json({ err: err.message });
	}
};

export const removeFolder = async (req, res) => {
	try {
		const { folderId, groupId } = req.body;

		// firebase
		const notes = await Note.find({ folderId: folderId });
		const noteIds = notes.map((note) => note._id.toString());
		const group = await Group.findById(groupId);
		const groupAdminId = group.groupAdminId.toString();
		const memberIds = Array.from(group.members.keys())
			.filter((id) => id !== groupAdminId)
			.map((id) => id.toString());

		await removeNoteNotifications({ memberIds, noteIds });

		// delete notes in firebase
		for (const note of notes) {
			await deleteFile(note.filePath);
		}

		const deletedNotes = await Note.deleteMany({ folderId });

		if (!deletedNotes) {
			return res.status(400).json({ msg: "Fail to remove notes" });
		}

		const deletedFolder = await Folder.findByIdAndDelete(folderId);

		if (!deletedFolder) {
			return res.status(400).json({ msg: "Fail to remove folder" });
		}

		res.status(200).json({ msg: "Success", folderId });
	} catch (err) {
		console.log(err);

		res.status(500).json({ error: err.message });
	}
};

export const renameFolder = async (req, res) => {
	try {
		const { folderId, name } = req.body;

		const renamedFolder = await Folder.findByIdAndUpdate(
			folderId,
			{
				$set: { name: name },
			},
			{ new: true }
		);

		if (!renamedFolder) {
			return res.status(400).json({ msg: "Fail to rename folder" });
		}

		const numberOfNotes = await Note.countDocuments({
			folderId: renamedFolder._id,
		});

		const returnedFolder = {
			...renamedFolder._doc,
			numberOfNotes,
		};

		res.status(200).json({ msg: "Success", returnedFolder });
	} catch (err) {
		console.log(err);

		res.status(500).json({ error: err.message });
	}
};

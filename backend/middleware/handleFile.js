import {
	ref,
	uploadBytes,
	getDownloadURL,
	deleteObject,
} from "firebase/storage";
import { storage } from "../firebase-config.js";

export const uploadFile = async (folder, file) => {
	try {
		const filename = new Date().getTime() + "-" + file.originalname;
		const fileRef = ref(storage, folder + filename);
		const snapshot = await uploadBytes(fileRef, file.buffer);
		const fileURL = await getDownloadURL(snapshot.ref);

		return fileURL;
	} catch (error) {
		console.error("Error uploading image:", error);
		throw new Error("Failed to upload image to Firebase Storage");
	}
};

export const deleteFile = async (path) => {
	try {
		const fileRef = ref(storage, path);
		await deleteObject(fileRef);
	} catch (err) {
		console.error("Error deleting file:", err);
		throw new Error("Failed to delete file from Firebase Storage");
	}
};

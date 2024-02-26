import { Post } from "../models/postModel.js";
import { Comment } from "../models/commentModel.js";
import { formatDateTime } from "../usefulFunction.js";

export const getComments = async (req, res) => {
	try {
		const { postId } = req.body;

		const comments = await Comment.find({ postId })
			.sort({ createdAt: -1 })
			.populate({
				path: "userId",
				select: "userName userProfile.profileImagePath",
			})
			.exec();

		if (!comments) {
			res.status(404).json({ msg: "Comment not found" });
			return;
		}

		if (comments.length === 0) {
			res.status(200).json({ msg: "No comment" });
			return;
		}

		res.status(200).json({ msg: "Success", comments });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

export const addComment = async (req, res) => {
	try {
		const { postId, userId, comment } = req.body;

		const commentTime = new Date();
		const formattedCommentTime = formatDateTime(commentTime);

		const newComment = new Comment({
			postId,
			userId,
			commentDescription: comment,
			commentTime: formattedCommentTime,
		});

		const savedComment = await newComment.save();

		await Post.findByIdAndUpdate(postId, { $inc: { postComments: 1 } });

		res.status(200).json({ msg: "Success", savedComment });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

export const deleteComment = async (req, res) => {
	try {
		const { commentId, postId } = req.body;

		await Comment.findByIdAndDelete(commentId);

		await Post.findByIdAndUpdate(postId, { $inc: { postComments: -1 } });
		res.status(200).json({ msg: "Success" });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

export const getComment = async (req, res) => {
	const { commentId } = req.body;
	const comment = await Comment.findById(commentId).populate({
		path: "userId",
		select: "userName userProfile.profileImagePath",
	});

	if (!comment) {
		res.status(404).json({ msg: "Comment not found" });
	}

	res.status(200).json({ msg: "Success", comment });
};

export const editComment = async (req, res) => {
	try {
		const { commentId, newComment } = req.body;

		const updatedComment = await Comment.findByIdAndUpdate(
			commentId,
			{
				commentDescription: newComment,
			},
			{ new: true }
		).populate({
			path: "userId",
			select: "userName userProfile.profileImagePath",
		});

		if (!updatedComment) {
			res.status(404).json({ msg: "Comment not found" });
			return;
		}

		res.status(200).json({ msg: "Success", updatedComment });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

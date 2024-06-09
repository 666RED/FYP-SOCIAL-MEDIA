import { Post } from "../models/postModel.js";
import { Comment } from "../models/commentModel.js";
import { formatDateTime } from "../usefulFunction.js";
import { User } from "../models/userModel.js";
import { commentPost, deletePostComment } from "../API/firestoreAPI.js";

export const getComments = async (req, res) => {
	try {
		const limit = 10;
		const postId = req.query.postId;
		const count = req.query.count || 0;
		let currentTime;
		if (!req.query.currentTime) {
			currentTime = new Date();
		} else {
			currentTime = new Date(req.query.currentTime);
		}

		let comments = await Comment.find({
			postId,
			createdAt: { $lt: currentTime },
		})
			.sort({ createdAt: -1 })
			.skip(count)
			.limit(limit)
			.exec();

		if (!comments) {
			res.status(404).json({ msg: "Comment not found" });
			return;
		}

		if (comments.length === 0) {
			res.status(200).json({ msg: "No comment" });
			return;
		}

		comments = await Promise.all(
			comments.map(async (comment) => {
				const user = await User.findById(comment.userId);
				let profileImagePath = "";
				let userName = "";
				let frameColor = "";

				if (user) {
					profileImagePath = user.userProfile.profileImagePath;
					userName = user.userName;
					frameColor = user.userProfile.profileFrameColor;
				}

				const temp = {
					...comment._doc,
					time: formatDateTime(comment.createdAt),
					userName,
					profileImagePath,
					frameColor,
				};

				const { createdAt, updatedAt, __v, ...rest } = temp;

				return rest;
			})
		);

		res.status(200).json({ msg: "Success", comments });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

export const addComment = async (req, res) => {
	try {
		const { postId, postUserId, userId, comment } = req.body;

		const newComment = new Comment({
			postId,
			userId,
			commentDescription: comment,
		});

		let savedComment = await newComment.save();

		if (!savedComment) {
			return res.status(400).json({ msg: "Fail to add new comment" });
		}

		await Post.findByIdAndUpdate(postId, { $inc: { postComments: 1 } });

		const user = await User.findById(savedComment.userId);
		let profileImagePath = "";
		let userName = "";
		let frameColor = "";

		if (user) {
			profileImagePath = user.userProfile.profileImagePath;
			userName = user.userName;
			frameColor = user.userProfile.profileFrameColor;
		}

		// firebase
		if (userId !== postUserId) {
			const commentId = savedComment._id.toString();
			await commentPost({
				userId,
				userName,
				postId,
				commentId,
				postUserId,
			});
		}

		const temp = {
			...savedComment._doc,
			userName,
			profileImagePath,
			time: formatDateTime(savedComment.createdAt),
			frameColor,
		};

		const { createdAt, updatedAt, __v, ...rest } = temp;

		savedComment = rest;

		res.status(200).json({ msg: "Success", savedComment });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

export const deleteComment = async (req, res) => {
	try {
		let { commentId, postId, userId } = req.body;

		// firebase
		commentId = commentId.toString();
		const comment = await Comment.findById(commentId);
		await deletePostComment({ commentId, userId });

		const deletedComment = await Comment.findByIdAndDelete(commentId);

		if (!deletedComment) {
			return res.status(404).json({ msg: "Fail to delete comment" });
		}

		await Post.findByIdAndUpdate(postId, { $inc: { postComments: -1 } });

		res
			.status(200)
			.json({ msg: "Success", deletedCommentId: deletedComment._id });
	} catch (err) {
		console.log(err);

		res.status(500).json({ error: err.message });
	}
};

export const editComment = async (req, res) => {
	try {
		const { commentId, newComment } = req.body;

		let updatedComment = await Comment.findByIdAndUpdate(
			commentId,
			{
				commentDescription: newComment,
			},
			{ new: true }
		);

		const user = await User.findById(updatedComment.userId);
		let profileImagePath = "";
		let userName = "";
		let frameColor = "";

		if (user) {
			profileImagePath = user.userProfile.profileImagePath;
			userName = user.userName;
			frameColor = user.userProfile.profileFrameColor;
		}

		const temp = {
			...updatedComment._doc,
			userName,
			profileImagePath,
			time: formatDateTime(updatedComment.createdAt),
			frameColor,
		};

		const { createdAt, updatedAt, __v, ...rest } = temp;

		updatedComment = rest;

		if (!updatedComment) {
			res.status(404).json({ msg: "Fail to update comment" });
			return;
		}

		res.status(200).json({ msg: "Success", updatedComment });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

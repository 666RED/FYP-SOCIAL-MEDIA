import { GroupPost } from "../models/groupPostModel.js";
import { GroupPostComment } from "../models/groupPostCommentModel.js";
import { formatDateTime } from "../usefulFunction.js";
import { User } from "../models/userModel.js";

export const addGroupPostComment = async (req, res) => {
	try {
		const { groupPostId, userId, comment } = req.body;

		const commentTime = new Date();
		const formattedCommentTime = formatDateTime(commentTime);

		const newComment = new GroupPostComment({
			groupPostId,
			userId,
			commentDescription: comment,
			commentTime: formattedCommentTime,
		});

		const savedComment = await newComment.save();

		if (!savedComment) {
			return res.status(400).json({ msg: "Fail to add new comment" });
		}

		// increase amount of comment for a post
		await GroupPost.findByIdAndUpdate(groupPostId, {
			$inc: { postComments: 1 },
		});

		const user = await User.findById(userId);

		if (!user) {
			return res.status(404).json({ msg: "User not found" });
		}

		const userName = user.userName;
		const profileImagePath = user.userProfile.profileImagePath;

		res.status(200).json({
			msg: "Success",
			returnComment: {
				...savedComment._doc,
				userName,
				profileImagePath,
			},
		});
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

export const getComments = async (req, res) => {
	try {
		const limit = 10;
		const { postId } = req.query;
		const count = req.query.count || 0;
		let currentTime;
		if (!req.query.currentTime) {
			currentTime = new Date();
		} else {
			currentTime = new Date(req.query.currentTime);
		}

		const comments = await GroupPostComment.find({
			groupPostId: postId,
			createdAt: { $lt: currentTime },
		})
			.sort({ createdAt: -1 })
			.skip(count)
			.limit(limit);

		if (!comments) {
			return res.status(400).json({ msg: "Fail to retrieve comments" });
		}

		if (comments.length < 1) {
			return res.status(200).json({ msg: "No comment" });
		}

		const returnComments = await Promise.all(
			comments.map(async (comment) => {
				const user = await User.findById(comment.userId);

				if (user) {
					const userName = user.userName;
					const profileImagePath = user.userProfile.profileImagePath;

					return {
						...comment._doc,
						userName,
						profileImagePath,
					};
				} else {
					return null;
				}
			})
		);

		res.status(200).json({ msg: "Success", returnComments });
	} catch (err) {
		console.log(err);

		res.status(500).json({ error: err.message });
	}
};

export const editComment = async (req, res) => {
	try {
		const { commentId, newComment, userId } = req.body;

		const updatedComment = await GroupPostComment.findByIdAndUpdate(
			commentId,
			{
				commentDescription: newComment,
			},
			{ new: true }
		);

		if (!updatedComment) {
			return res.status(400).json({ msg: "Fail to update comment" });
		}

		const user = await User.findById(userId);

		if (!user) {
			return res.status(404).json({ msg: "User not found" });
		}

		const userName = user.userName;
		const profileImagePath = user.userProfile.profileImagePath;

		res.status(200).json({
			msg: "Success",
			returnComment: { ...updatedComment._doc, userName, profileImagePath },
		});
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

export const deleteComment = async (req, res) => {
	try {
		const { commentId, postId } = req.body;

		const deletedComment = await GroupPostComment.findByIdAndDelete(commentId);

		if (!deleteComment) {
			return res.status(400).json({ msg: "Fail to delete comment" });
		}

		await GroupPost.findByIdAndUpdate(postId, { $inc: { postComments: -1 } });

		res
			.status(200)
			.json({ msg: "Success", deletedCommentId: deletedComment._id });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

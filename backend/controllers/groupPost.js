import { GroupPost } from "../models/groupPostModel.js";
import { User } from "../models/userModel.js";
import { formatDateTime } from "../usefulFunction.js";
import path from "path";
import fs from "fs";
import { __dirname } from "../index.js";
import { GroupPostComment } from "../models/groupPostCommentModel.js";

export const addNewGroupPost = async (req, res) => {
	try {
		const { groupId, userId, text } = req.body;

		const image = req.files && req.files.image;
		const file = req.files && req.files.file;

		let newPost;

		// just text
		if (!image && !file) {
			newPost = new GroupPost({
				groupId,
				userId,
				postDescription: text,
			});
		} else if (!file) {
			// only upload image
			newPost = new GroupPost({
				groupId,
				userId,
				postDescription: text,
				postImagePath: image[0].filename,
			});
		} else if (!image) {
			// only upload file
			newPost = new GroupPost({
				groupId,
				userId,
				postDescription: text,
				postFilePath: file[0].filename,
			});
		}

		let savedPost = await newPost.save();

		if (!savedPost) {
			return res.status(400).json({ msg: "Fail to add new post" });
		}

		const returnUser = await User.findById(userId);
		let userName = "";
		let profileImagePath = "";
		let frameColor = "";

		if (returnUser) {
			userName = returnUser.userName;
			profileImagePath = returnUser.userProfile.profileImagePath;
			frameColor = returnUser.userProfile.profileFrameColor;
		}

		const { createdAt, updatedAt, __v, ...rest } = savedPost._doc;

		res.status(200).json({
			msg: "Success",
			returnPost: {
				...rest,
				userName,
				profileImagePath,
				time: formatDateTime(savedPost.createdAt),
				frameColor,
			},
		});
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

export const getGroupPosts = async (req, res) => {
	try {
		const limit = 10;
		const count = parseInt(req.query.count) || 0;
		const groupId = req.query.groupId;
		const currentTime = new Date(req.query.currentTime) || new Date();

		const groupPosts = await GroupPost.find({
			groupId,
			createdAt: { $lt: currentTime },
			removed: 0,
		})
			.sort({ createdAt: -1 })
			.skip(count)
			.limit(limit);

		if (!groupPosts) {
			return res.status(400).json({ msg: "Fail to retrieve group posts" });
		}

		if (groupPosts.length === 0) {
			return res.status(200).json({ msg: "No post" });
		}

		const returnGroupPosts = await Promise.all(
			groupPosts.map(async (post) => {
				const user = await User.findById(post.userId);
				let profileImagePath = "";
				let userName = "'";
				let frameColor = "";

				if (user) {
					userName = user.userName;
					profileImagePath = user.userProfile.profileImagePath;
					frameColor = user.userProfile.profileFrameColor;
				}

				return {
					...post._doc,
					userName,
					profileImagePath,
					time: formatDateTime(post.createdAt),
					frameColor,
				};
			})
		);

		res.status(200).json({ msg: "Success", returnGroupPosts });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

export const upLikes = async (req, res) => {
	try {
		const { groupId, postId, userId } = req.body;

		const updatedPost = await GroupPost.findOneAndUpdate(
			{ groupId, _id: postId },
			{
				$inc: { postLikes: 1 },
				$set: { [`likesMap.${userId}`]: true },
			}
		);

		if (!updatedPost) {
			return res.status(400).json({ msg: "Fail to update post" });
		}

		res.status(200).json({ msg: "Success" });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

export const downLikes = async (req, res) => {
	try {
		const { groupId, postId, userId } = req.body;

		const updatedPost = await GroupPost.findOneAndUpdate(
			{ groupId, _id: postId },
			{
				$inc: { postLikes: -1 },
				$unset: { [`likesMap.${userId}`]: true },
			}
		);

		if (!updatedPost) {
			return res.status(400).json({ msg: "Fail to update post" });
		}

		res.status(200).json({ msg: "Success" });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

export const deletePost = async (req, res) => {
	try {
		const { postId, postImagePath, postFilePath } = req.body;

		// delete all comments in the group post
		const deletedComments = await GroupPostComment.deleteMany({
			groupPostId: postId,
		});

		if (!deletedComments) {
			return res.status(400).json({ msg: "Fail to delete comments" });
		}

		// delete post
		const deletedPost = await GroupPost.findByIdAndUpdate(postId, {
			$set: { removed: 1 },
		});

		if (!deletedPost) {
			return res.status(400).json({ msg: "Fail to delete post" });
		}

		// delete group post image if got any
		if (postImagePath !== "") {
			const deletedPostImagePath = path.join(
				__dirname,
				"public/images/group-post",
				postImagePath
			);
			fs.unlinkSync(deletedPostImagePath);
		}

		// delete group post file if got any
		if (postFilePath !== "") {
			const deletedPostFilePath = path.join(
				__dirname,
				"public/images/group-post",
				postFilePath
			);
			fs.unlinkSync(deletedPostFilePath);
		}

		res.status(200).json({ msg: "Success" });
	} catch (err) {
		res.status(500).json({ err: err.message });
	}
};

export const editGroupPost = async (req, res) => {
	try {
		const { postId, text, postImagePath, postFilePath, userId } = req.body;

		const image = req.files && req.files.image;
		const file = req.files && req.files.file;

		const originalPost = await GroupPost.findById(postId);
		const originalPostImagePath = originalPost.postImagePath;
		const originalPostFilePath = originalPost.postFilePath;

		if (!originalPost) {
			return res.status(404).json({ msg: "Original post not found" });
		}

		const removeImage =
			postImagePath === "" && originalPost.postImagePath !== "";

		const removeFile = postFilePath === "" && originalPost.postFilePath !== "";

		let updatedPost;

		let updatedImagePath;
		let needUpdateImage = true;

		if (removeImage) {
			updatedImagePath = "";
		} else {
			if (image) {
				updatedImagePath = image[0].filename;
			} else {
				needUpdateImage = false;
			}
		}

		let updatedFilePath;
		let needUpdateFile = true;

		if (removeFile) {
			updatedFilePath = "";
		} else {
			if (file) {
				updatedFilePath = file[0].filename;
			} else {
				needUpdateFile = false;
			}
		}

		if (needUpdateImage && needUpdateFile) {
			updatedPost = await GroupPost.findByIdAndUpdate(
				postId,
				{
					$set: {
						postDescription: text,
						postImagePath: updatedImagePath,
						postFilePath: updatedFilePath,
					},
				},
				{ new: true }
			);
			// remove image only
		} else if (needUpdateImage && !needUpdateFile) {
			updatedPost = await GroupPost.findByIdAndUpdate(
				postId,
				{
					$set: {
						postDescription: text,
						postImagePath: updatedImagePath,
						postFilePath: updatedFilePath,
					},
				},
				{ new: true }
			);
			// remove file only
		} else if (!needUpdateImage && needUpdateFile) {
			updatedPost = await GroupPost.findByIdAndUpdate(
				postId,
				{
					$set: {
						postDescription: text,
						postFilePath: updatedFilePath,
					},
				},
				{ new: true }
			);
		}
		// no update image and file
		else {
			updatedPost = await GroupPost.findByIdAndUpdate(
				postId,
				{
					$set: {
						postDescription: text,
					},
				},
				{ new: true }
			);
		}

		if (!updatedPost) {
			return res.status(400).json({ msg: "Fail to update post" });
		}

		const user = await User.findById(userId);
		let profileImagePath = "";
		let userName = "";
		let frameColor = "";

		if (user) {
			userName = user.userName;
			profileImagePath = user.userProfile.profileImagePath;
			frameColor = user.userProfile.profileFrameColor;
		}

		const { createdAt, updatedAt, __v, ...rest } = updatedPost._doc;

		// delete original post image
		if ((image && originalPostImagePath !== "") || removeImage) {
			const postImagePath = path.join(
				__dirname,
				"public/images/group-post",
				originalPostImagePath
			);
			fs.unlinkSync(postImagePath);
		}

		// delete original post file
		if ((file && originalPostFilePath !== "") || removeFile) {
			const postFilePath = path.join(
				__dirname,
				"public/images/group-post",
				originalPostFilePath
			);
			fs.unlinkSync(postFilePath);
		}

		res.status(200).json({
			msg: "Success",
			returnGroupPost: { ...rest, userName, profileImagePath, frameColor },
		});
	} catch (err) {
		res.status(500).json({ err: err.message });
	}
};

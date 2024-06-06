import { Post } from "../models/postModel.js";
import { Comment } from "../models/commentModel.js";
import { formatDateTime } from "../usefulFunction.js";
import { User } from "../models/userModel.js";
import mongoose from "mongoose";

import { uploadFile, deleteFile } from "../middleware/handleFile.js";
import {
	cancelPostLike,
	deletePostLikesAndComments,
	likePost,
} from "../API/firestoreAPI.js";

export const addNewPost = async (req, res) => {
	try {
		const { userId, text } = req.body;

		const image = req.file;

		let newPost;

		if (!image) {
			newPost = new Post({
				userId,
				postDescription: text,
				likesMap: new Map(),
			});
		} else {
			const imageURL = await uploadFile("post/", image);
			newPost = new Post({
				userId,
				postDescription: text,
				postImagePath: imageURL,
				likesMap: new Map(),
			});
		}

		let savedPost = await newPost.save();

		if (!savedPost) {
			return res.status(400).json({ msg: "Fail to add new post" });
		}

		const user = await User.findById(savedPost.userId);
		let profileImagePath = "";
		let userName = "";
		let frameColor = "";

		if (user) {
			profileImagePath = user.userProfile.profileImagePath;
			userName = user.userName;
			frameColor = user.userProfile.profileFrameColor;
		}

		savedPost = {
			...savedPost._doc,
			time: formatDateTime(savedPost.createdAt),
			profileImagePath,
			userName,
			frameColor,
		};

		const { createdAt, updatedAt, __v, ...rest } = savedPost;

		const returnPost = rest;

		if (!returnPost) {
			return res.status(404).json({ msg: "Post not found" });
		}

		res.status(201).json({ msg: "Success", returnPost });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

export const getPosts = async (req, res) => {
	try {
		const limit = 10;
		const count = parseInt(req.query.count) || 0;
		const userId = req.query.userId;

		let posts = await Post.find({ userId, removed: 0 })
			.sort({ createdAt: -1 })
			.skip(count)
			.limit(limit);

		if (!posts) {
			return res.status(400).json({ msg: "Fail to retrieve posts" });
		}

		if (posts.length === 0) {
			return res.status(200).json({ msg: "No post" });
		}

		const userIds = posts.map((post) => post.userId);

		const users = await User.find({ _id: { $in: userIds } });

		posts = posts.map((post) => {
			const user = users.find(
				(user) => user._id.toString() === post.userId.toString()
			);
			const { createdAt, updatedAt, __v, ...rest } = post._doc;
			return {
				...rest,
				time: formatDateTime(createdAt),
				userName: user ? user.userName : "",
				profileImagePath: user ? user.userProfile.profileImagePath : "",
				frameColor: user ? user.userProfile.profileFrameColor : "",
			};
		});

		res.status(200).json({ msg: "Success", posts });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

export const upLikes = async (req, res) => {
	try {
		let { postId, userId } = req.body;

		const updatedPost = await Post.findOneAndUpdate(
			{ _id: postId },
			{
				$inc: { postLikes: 1 },
				$set: { [`likesMap.${userId}`]: true },
			}
		);

		if (!updatedPost) {
			return res.status(400).json({ msg: "Fail to update post" });
		}

		if (updatedPost.userId.toString() !== userId) {
			const user = await User.findById(userId);
			userId = userId.toString();
			const userName = user.userName;
			const profileImagePath = user.userProfile.profileImagePath;
			const postUserId = updatedPost.userId.toString();

			await likePost(userId, userName, profileImagePath, postId, postUserId);
		}

		res.status(200).json({ msg: "Success" });
	} catch (err) {
		console.log(err);

		res.status(500).json({ error: err.message });
	}
};

export const downLikes = async (req, res) => {
	try {
		const { postId, userId } = req.body;

		const updatedPost = await Post.findOneAndUpdate(
			{ _id: postId },
			{
				$inc: { postLikes: -1 },
				$unset: { [`likesMap.${userId}`]: true },
			}
		);

		if (!updatedPost) {
			return res.status(400).json({ msg: "Fail to update post" });
		}

		const postUserId = updatedPost.userId.toString();

		await cancelPostLike(postId, userId);

		res.status(200).json({ msg: "Success" });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

export const editPost = async (req, res) => {
	try {
		const { postId, postDescription, postImagePath } = req.body;
		const postImage = req.file;

		const originalPost = await Post.findById(postId);
		const originalPostImagePath = originalPost.postImagePath;

		let updatedPost;

		const removeImage = postImagePath === "" && originalPostImagePath !== "";

		if (postImage || removeImage) {
			// update both post description and image
			const imageURL = removeImage ? "" : await uploadFile("post/", postImage);
			updatedPost = await Post.findByIdAndUpdate(
				postId,
				{
					$set: {
						postDescription,
						postImagePath: imageURL,
					},
				},
				{ new: true }
			);
		} else {
			// only update post description
			updatedPost = await Post.findByIdAndUpdate(
				postId,
				{
					$set: {
						postDescription,
					},
				},
				{ new: true }
			);
		}

		if (!updatedPost) {
			return res.status(400).json({ msg: "Fail to update post" });
		}

		const user = await User.findById(updatedPost.userId);
		let profileImagePath = "";
		let userName = "";
		let frameColor = "";

		if (user) {
			profileImagePath = user.userProfile.profileImagePath;
			userName = user.userName;
			frameColor = user.userProfile.profileFrameColor;
		}

		const temp = {
			...updatedPost._doc,
			time: formatDateTime(updatedPost.createdAt),
			userName,
			profileImagePath,
			frameColor,
		};

		const { createdAt, updatedAt, __v, ...rest } = temp;

		updatedPost = rest;

		// delete original post image
		if ((postImage && originalPostImagePath !== "") || removeImage) {
			await deleteFile(originalPostImagePath);
		}

		res.status(200).json({ msg: "Success", updatedPost });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

export const deletePost = async (req, res) => {
	try {
		const { postId } = req.body;

		// delete post
		const deletedPost = await Post.findByIdAndUpdate(
			postId,
			{
				$set: { removed: 1 },
			},
			{ new: true }
		);

		if (!deletedPost) {
			return res.status(400).json({ msg: "Fail to delete post" });
		}

		// delete post image if got any
		if (deletedPost.postImagePath !== "") {
			await deleteFile(deletedPost.postImagePath);
		}

		// delete notificaitons
		const userIds = Array.from(deletedPost.likesMap.keys()).map((id) =>
			id.toString()
		);
		const comments = await Comment.find({ postId });
		const commentIds = comments.map((comment) => comment._id.toString());

		await deletePostLikesAndComments(postId, userIds, commentIds);

		// delete all comments in the post
		const deletedComments = await Comment.deleteMany({ postId });

		if (!deletedComments) {
			return res.status(400).json({ msg: "Fail to delete comments" });
		}

		res.status(200).json({ msg: "Success" });
	} catch (err) {
		console.log(err);

		res.status(500).json({ err: err.message });
	}
};

export const getHomePosts = async (req, res) => {
	try {
		const limit = 10;
		const userId = req.query.userId;

		const postsIds = JSON.parse(req.query.postIds);

		const user = await User.findById(userId);

		if (!user) {
			return res.status(400).json({ msg: "Fail to retrieve posts" });
		}

		const friendsIds = Array.from(user.userFriendsMap.keys());

		let posts = await Post.find({
			userId: {
				$in: [
					...friendsIds.map((id) => new mongoose.Types.ObjectId(id)),
					new mongoose.Types.ObjectId(userId),
				],
			},
			_id: { $nin: postsIds.map((id) => new mongoose.Types.ObjectId(id)) },
			removed: 0,
		})
			.limit(limit)
			.sort({
				createdAt: -1,
			});

		if (!posts) {
			return res.status(400).json({ msg: "Fail to retrieve posts" });
		}

		if (posts.length === 0) {
			return res.status(200).json({ msg: "No post" });
		}

		const userIds = posts.map((post) => post.userId);

		const users = await User.find({ _id: { $in: userIds } });

		posts = posts.map((post) => {
			const user = users.find(
				(user) => user._id.toString() === post.userId.toString()
			);
			const { createdAt, updatedAt, __v, ...rest } = post._doc;
			return {
				...rest,
				time: formatDateTime(createdAt),
				userName: user ? user.userName : "",
				profileImagePath: user ? user.userProfile.profileImagePath : "",
				frameColor: user ? user.userProfile.profileFrameColor : "",
			};
		});

		res.status(200).json({ msg: "Success", returnedPosts: posts });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

import { Post } from "../models/postModel.js";
import { Comment } from "../models/commentModel.js";
import { User } from "../models/userModel.js";
import { GroupPost } from "../models/groupPostModel.js";
import { CampusCondition } from "../models/campusConditionModel.js";
import { Group } from "../models/groupModel.js";
import { formatDateTime } from "../usefulFunction.js";
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

		const returnPost = { ...rest, type: "Post" };

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

export const getPost = async (req, res) => {
	try {
		const { userId, postId } = req.query;

		const post = await Post.findById(postId);

		if (!post) {
			return res.status(400).json({ msg: "Fail to get post" });
		}

		const user = await User.findById(userId);

		const { createdAt, updatedAt, __v, ...rest } = post._doc;
		const returnedPost = {
			...rest,
			time: formatDateTime(createdAt),
			userName: user ? user.userName : "",
			profileImagePath: user ? user.userProfile.profileImagePath : "",
			frameColor: user ? user.userProfile.profileFrameColor : "",
		};

		res.status(200).json({ msg: "Success", returnedPost });
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

		// firebase
		if (updatedPost.userId.toString() !== userId) {
			const user = await User.findById(userId);
			userId = userId.toString();
			const userName = user.userName;
			const postUserId = updatedPost.userId.toString();

			await likePost({
				userId,
				userName,
				postId,
				postUserId,
			});
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

		// firebase
		if (updatedPost.userId.toString() !== userId) {
			await cancelPostLike({ postId, userId });
		}

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

		updatedPost = { ...rest, type: "Post" };

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
		let comments = await Comment.find({ postId });
		comments = comments.map((comment) => ({
			commentId: comment._id.toString(),
			userId: comment.userId.toString(),
		}));

		await deletePostLikesAndComments({
			postId,
			userIds,
			comments,
		});

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
		const returnLimit = 15;
		const userId = req.query.userId;

		const posts = JSON.parse(req.query.posts);

		const excludedFriendPostIds = posts
			.filter((post) => post.type === "Friend")
			.map((post) => new mongoose.Types.ObjectId(post.id));
		const excludedGroupPostIds = posts
			.filter((post) => post.type === "Group")
			.map((post) => new mongoose.Types.ObjectId(post.id));
		const excludedConditionIds = posts
			.filter((post) => post.type === "Condition")
			.map((post) => new mongoose.Types.ObjectId(post.ic));

		const user = await User.findById(userId);

		if (!user) {
			return res.status(400).json({ msg: "Fail to retrieve posts" });
		}

		const friendsIds = Array.from(user.userFriendsMap.keys()).map(
			(id) => new mongoose.Types.ObjectId(id)
		);

		const groupIds = Array.from(user.groups.keys()).map(
			(id) => new mongoose.Types.ObjectId(id)
		);

		const friendPosts = await Post.aggregate([
			{
				$match: {
					userId: { $in: [...friendsIds, new mongoose.Types.ObjectId(userId)] },
					_id: { $nin: excludedFriendPostIds },
					removed: false,
				},
			},
			{ $sample: { size: limit } },
			{ $addFields: { type: "Post" } },
		]);
		if (!friendPosts) {
			return res.status(400).json({ msg: "Fail to retrieve posts" });
		}

		const groupPosts = await GroupPost.aggregate([
			{
				$match: {
					_id: { $in: groupIds.map((id) => new mongoose.Types.ObjectId(id)) },
					_id: {
						$nin: excludedGroupPostIds.map(
							(id) => new mongoose.Types.ObjectId(id)
						),
					},
					removed: false,
				},
			},
			{ $sample: { size: limit } },
			{
				$lookup: {
					from: "groups", // The name of the Group collection
					localField: "groupId", // The field in GroupPost that matches the Group _id
					foreignField: "_id",
					as: "groupInfo",
				},
			},
			{
				$project: {
					groupName: { $arrayElemAt: ["$groupInfo.groupName", 0] },
					groupImagePath: { $arrayElemAt: ["$groupInfo.groupImagePath", 0] },
					type: { $literal: "Group" }, // Add the type field
					_id: 1,
					groupId: 1,
					userId: 1,
					postLikes: 1,
					postComments: 1,
					likesMap: 1,
					postDescription: 1,
					postImagePath: 1,
					postFilePath: 1,
					postFileOriginalName: 1,
					removed: 1,
					createdAt: 1,
					updatedAt: 1,
					__v: 1,
				},
			},
		]);
		if (!groupPosts) {
			return res.status(400).json({ msg: "Fail to retrieve posts" });
		}

		const conditionPosts = await CampusCondition.aggregate([
			{
				$match: {
					_id: { $nin: excludedConditionIds },
					removed: false,
				},
			},
			{ $sample: { size: limit } },
			{ $addFields: { type: "Condition" } },
		]);
		if (!conditionPosts) {
			return res.status(400).json({ msg: "Fail to retrieve posts" });
		}

		let combinedPosts = [...friendPosts, ...groupPosts, ...conditionPosts];

		// randomly pick
		combinedPosts = combinedPosts
			.sort(() => 0.5 - Math.random())
			.slice(0, returnLimit);

		if (!combinedPosts.length) {
			return res.status(200).json({ msg: "No post" });
		}

		const userIds = combinedPosts.map((post) => post.userId);

		const users = await User.find({ _id: { $in: userIds } });

		combinedPosts = combinedPosts.map((post) => {
			const user = users.find(
				(user) => user._id.toString() === post.userId.toString()
			);
			let group;

			const { createdAt, updatedAt, __v, ...rest } = post;
			return {
				...rest,
				time: formatDateTime(createdAt),
				userName: user ? user.userName : "",
				profileImagePath: user ? user.userProfile.profileImagePath : "",
				frameColor: user ? user.userProfile.profileFrameColor : "",
			};
		});

		res.status(200).json({ msg: "Success", returnedPosts: combinedPosts });
	} catch (err) {
		console.log(err);

		res.status(500).json({ error: err.message });
	}
};

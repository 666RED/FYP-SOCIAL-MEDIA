import { Post } from "../models/postModel.js";
import { Comment } from "../models/commentModel.js";
import { formatDateTime } from "../usefulFunction.js";
import path from "path";
import fs from "fs";
import { __dirname } from "../index.js";

export const addNewPost = async (req, res) => {
	try {
		const { userId, text } = req.body;

		const image = req.file;

		const postTime = new Date();
		const formattedPostTime = formatDateTime(postTime);

		let newPost;

		if (!image) {
			newPost = new Post({
				userId,
				postTime: formattedPostTime,
				postDescription: text,
				likesMap: new Map(),
			});
		} else {
			newPost = new Post({
				userId,
				postTime: formattedPostTime,
				postDescription: text,
				postImagePath: image.filename,
				likesMap: new Map(),
			});
		}

		const savedPost = await newPost.save();

		if (!savedPost) {
			return res.status(400).json({ msg: "Fail to add new post" });
		}

		const returnPost = await savedPost.populate(
			"userId",
			"userName userProfile"
		);

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

		const posts = await Post.find({ userId })
			.populate({
				path: "userId",
				select: "userName userProfile.profileImagePath",
			})
			.sort({ createdAt: -1 })
			.skip(count)
			.limit(limit);

		if (!posts) {
			return res.status(400).json({ msg: "Fail to retrieve posts" });
		}

		if (posts.length === 0) {
			return res.status(200).json({ msg: "No post" });
		}

		res.status(200).json({ msg: "Success", posts });
	} catch (err) {
		console.log(err);

		res.status(500).json({ error: err.message });
	}
};

export const upLikes = async (req, res) => {
	try {
		const { postId, userId } = req.body;

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

		res.status(200).json({ msg: "Success" });
	} catch (err) {
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

		res.status(200).json({ msg: "Success" });
	} catch (err) {
		console.log(err);

		res.status(500).json({ error: err.message });
	}
};

export const editPost = async (req, res) => {
	try {
		const { postId, postDescription, postImagePath } = req.body;
		const postImage = req.file;

		const originalPost = await Post.findById(postId);

		let updatedPost;

		const removeImage =
			postImagePath === "" && originalPost.postImagePath !== "";

		// delete original post image
		if ((postImage && originalPost.postImagePath !== "") || removeImage) {
			const postImagePath = path.join(
				__dirname,
				"public/images/post",
				originalPost.postImagePath
			);
			fs.unlinkSync(postImagePath);
		}

		if (postImage || removeImage) {
			// update both post description and image
			updatedPost = await Post.findByIdAndUpdate(
				postId,
				{
					$set: {
						postDescription,
						postImagePath: removeImage ? "" : postImage.filename,
					},
				},
				{ new: true }
			).populate("userId", "userName userProfile");
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
			).populate("userId", "userName userProfile");
		}

		if (!updatedPost) {
			return res.status(400).json({ msg: "Fail to update post" });
		}

		res.status(200).json({ msg: "Success", updatedPost });
	} catch (err) {
		console.log(err);

		res.status(500).json({ error: err.message });
	}
};

export const deletePost = async (req, res) => {
	try {
		const { post } = req.body;

		// delete all comments in the post
		const deletedComments = await Comment.deleteMany({ postId: post._id });

		if (!deletedComments) {
			return res.status(400).json({ msg: "Fail to delete comments" });
		}

		// delete post image if got any
		if (post.postImagePath !== "") {
			const postImagePath = path.join(
				__dirname,
				"public/images/post",
				post.postImagePath
			);
			fs.unlinkSync(postImagePath);
		}

		// delete post
		const deletedPost = await Post.findByIdAndDelete(post._id);

		if (!deletePost) {
			return res.status(400).json({ msg: "Fail to delete post" });
		}

		res.status(200).json({ msg: "Success" });
	} catch (err) {
		console.log(err);

		res.status(500).json({ err: err.message });
	}
};

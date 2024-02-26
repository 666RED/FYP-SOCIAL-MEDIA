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

		const returnPost = await savedPost.populate(
			"userId",
			"userName userProfile"
		);

		res.status(201).json({ msg: "Success", returnPost });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

export const getPosts = async (req, res) => {
	try {
		const { userId } = req.body;

		const posts = await Post.find({ userId })
			.populate({
				path: "userId",
				select: "userName userProfile.profileImagePath",
			})
			.sort({ createdAt: -1 });

		if (posts.length === 0) {
			return res.status(200).json({ msg: "No post" });
		}

		res.status(200).json({ msg: "Success", posts });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

export const upLikes = async (req, res) => {
	try {
		const { postId } = req.body;

		const post = await Post.findById(postId);

		post.likesMap.set(post.userId, true);

		const updatedPost = await Post.findOneAndUpdate(
			{ _id: postId },
			{
				$inc: { postLikes: 1 }, // Increment postLikes by 1
				$set: { likesMap: post.likesMap }, // Set isLiked to true
			},
			{ new: true } // Return the updated document
		);

		if (!updatedPost) {
			return res.status(400).json({ msg: "Post not found" });
		}

		res.status(200).json({ msg: "Success", updatedPost });
	} catch (err) {
		console.log(err);

		res.status(500).json({ error: err.message });
	}
};

export const downLikes = async (req, res) => {
	try {
		const { postId } = req.body;

		const post = await Post.findById(postId);

		const isLiked = post.likesMap.get(post.userId);

		post.likesMap.delete(post.userId);

		const updatedPost = await Post.findOneAndUpdate(
			{ _id: postId },
			{
				$inc: { postLikes: -1 }, // Decrement postLikes by 1
				$set: { likesMap: post.likesMap }, // Set isLiked to true
			},
			{ new: true } // Return the updated document
		);

		if (!updatedPost) {
			return res.status(400).json({ msg: "Post not found" });
		}

		res.status(200).json({ msg: "Success", updatedPost });
	} catch (err) {
		console.log(err);

		res.status(500).json({ error: err.message });
	}
};

export const editPost = async (req, res) => {
	try {
		const { postId, postDescription, userId, postImagePath } = req.body;
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
			return res.status(400).json({ msg: "Post not found" });
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
		await Comment.deleteMany({ postId: post._id });

		const originalPost = await Post.findById(post._id);

		// delete post image if got any
		if (post.postImagePath !== "") {
			const postImagePath = path.join(
				__dirname,
				"public/images/post",
				originalPost.postImagePath
			);
			fs.unlinkSync(postImagePath);
		}

		// delete post
		await Post.findByIdAndDelete(post._id);

		res.status(200).json({ msg: "Success" });
	} catch (err) {
		console.log(err);

		res.status(500).json({ err: err.message });
	}
};

import { Post } from "../models/postModel.js";
import { formatDateTime } from "../usefulFunction.js";
import { Comment } from "../models/commentModel.js";
// import { User } from "../models/userModel.js";

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
			});
		} else {
			newPost = new Post({
				userId,
				postTime: formattedPostTime,
				postDescription: text,
				postImagePath: image.filename,
			});
		}

		const savedPost = await newPost.save();

		res.status(201).json({ msg: "Success", savedPost });
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

		const updatedPost = await Post.findOneAndUpdate(
			{ _id: postId },
			{
				$inc: { postLikes: 1 }, // Increment postLikes by 1
				$set: { isLiked: true }, // Set isLiked to true
			},
			{ new: true } // Return the updated document
		);

		if (!updatedPost) {
			return res.status(400).json({ msg: "Post not found" });
		}

		res.status(200).json({ msg: "Success", updatedPost });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

export const downLikes = async (req, res) => {
	try {
		const { postId } = req.body;

		const updatedPost = await Post.findOneAndUpdate(
			{ _id: postId },
			{
				$inc: { postLikes: -1 }, // Decreement postLikes by 1
				$set: { isLiked: false }, // Set isLiked to false
			},
			{ new: true } // Return the updated document
		);

		if (!updatedPost) {
			return res.status(400).json({ msg: "Post not found" });
		}

		res.status(200).json({ msg: "Success", updatedPost });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

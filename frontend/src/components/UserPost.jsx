import { React, useState, useEffect } from "react";
import Post from "./Post.jsx";

const UserPost = ({ userId, postAdded }) => {
	const [posts, setPosts] = useState([]);
	const [hasPost, setHasPost] = useState(false);

	useEffect(() => {
		const getPost = async () => {
			await fetch("https://fyp-social-media.onrender.com/post/get-posts", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					userId,
				}),
			})
				.then((res) => res.json())
				.then(({ msg, posts = [] }) => {
					if (msg === "No post") {
						setHasPost(false);
					} else if (msg === "Success") {
						setPosts(posts.map((post) => <Post post={post} key={post._id} />));
						setHasPost(true);
					}
				});
		};
		getPost();
	}, [postAdded]);

	return (
		<div>{hasPost ? posts : <h2 className="text-center">No post</h2>}</div>
	);
};

export default UserPost;

import { React, useState } from "react";
import { BsThreeDots } from "react-icons/bs/index.js";
import { HiThumbUp } from "react-icons/hi/index.js";
import { FaCommentDots } from "react-icons/fa/index.js";

const Post = ({ post }) => {
	const profileImgPath =
		"https://fyp-social-media.onrender.com/public/images/profile/";
	const postImgPath =
		"https://fyp-social-media.onrender.com/public/images/post/";

	const [liked, setLiked] = useState(post.isLiked);
	const [isActive, setIsActive] = useState(false);
	const [likes, setLikes] = useState(post.postLikes);

	const handleLikes = async () => {
		try {
			if (!liked) {
				setIsActive(true);

				setTimeout(() => {
					setIsActive(false);
				}, 300);
				setLikes((prevState) => prevState + 1);

				await fetch("https://fyp-social-media.onrender.com/post/up-likes", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						postId: post._id,
					}),
				})
					.then((res) => res.json())
					.then((data) => {
						// Success
					});
			} else {
				setLikes((prevState) => prevState - 1);

				await fetch("https://fyp-social-media.onrender.com/post/down-likes", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						postId: post._id,
					}),
				})
					.then((res) => res.json())
					.then((data) => {
						// Success
					});
			}

			setLiked((prevState) => !prevState);
		} catch (err) {
			console.log(err);
		}
	};

	const handleComment = () => {};

	return (
		<div className="container-fluid position-relative my-3 bg-light rounded-3 shadow py-4">
			<BsThreeDots
				className="position-absolute fs-4"
				style={{ cursor: "pointer", top: "25px", right: "12px" }}
			/>
			<div className="row d-flex align-items-center justify-content-between">
				<div className="col-12 d-flex align-items-center">
					<img
						src={
							profileImgPath +
							post.userId.userProfile.profileObj.profileImagePath
						}
						alt="Profile image"
						className="img-fluid rounded-circle me-2"
						style={{ maxWidth: "50px" }}
					/>
					<div>
						<p className="m-0">{post.userId.userName}</p>
						<p className="m-0 text-secondary" style={{ fontSize: "12px" }}>
							{post.postTime}
						</p>
					</div>
				</div>
				<p className="col-12 my-3">{post.postDescription}</p>
				<img
					src={postImgPath + post.postImagePath}
					className="img-fluid rounded-5 mx-auto"
					style={{ maxWidth: "1000px" }}
				/>
				<div className="container-fluid mt-3">
					<div className="row d-flex justify-content-around">
						<div className="col-6">
							<div
								className={`container-fluid border border-dark rounded-3 py-2 like-container`}
								style={{ maxWidth: "400px", cursor: "pointer" }}
								onClick={() => handleLikes()}
							>
								<div className="row align-items-center">
									<div
										className={`col-2 fs-4 pb-2 like-button ${
											liked && "text-primary"
										} ${isActive && "active"}`}
									>
										<HiThumbUp />
									</div>
									<h6 className="col-7 text-center m-0">Likes</h6>
									<p className="col-2 m-0 text-end">{likes}</p>
								</div>
							</div>
						</div>
						<div className="col-6">
							<div
								className="container-fluid border border-dark rounded-3 py-2"
								style={{ maxWidth: "400px" }}
							>
								<div className="row align-items-center">
									<div
										className="col-2 fs-4 pb-2"
										onClick={() => handleComment}
									>
										<FaCommentDots />
									</div>
									<h6 className="col-7 text-center m-0">Comment</h6>
									<p className="col-2 m-0 text-end">
										{post.postCommentArray.length}
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Post;

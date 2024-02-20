import { React, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Spinner from "./Spinner.jsx";
import { useSnackbar } from "notistack";

const UserProfile = ({ windowWidth, userId, setShowAddNewPostForm }) => {
	const navigate = useNavigate();
	const [name, setName] = useState("");
	const [profileImagePath, setProfileImagePath] = useState("");
	const [coverImagePath, setCoverImagePath] = useState("");
	const [bio, setBio] = useState("");
	const [loading, setLoading] = useState(false);
	const { enqueueSnackbar } = useSnackbar();
	const filePath =
		"https://fyp-social-media.onrender.com/public/images/profile/";

	useEffect(() => {
		const fetchData = async () => {
			setLoading(true);
			try {
				await fetch(
					`https://fyp-social-media.onrender.com/profile?userId=${userId}`,
					{
						method: "GET",
						headers: {
							"Content-Type": "application/json",
						},
					}
				)
					.then((res) => res.json())
					.then(({ msg, user = {} }) => {
						if (msg === "User not found") {
							enqueueSnackbar("User not found", {
								variant: "error",
							});
						} else if (msg === "Success") {
							const name = user.userName;
							const profileImagePath =
								user.userProfile.profileObj.profileImagePath;
							const coverImagePath =
								user.userProfile.profileObj.profileCoverImagePath;
							const profileBio = user.userProfile.profileObj.profileBio;
							setName(name);
							setProfileImagePath(filePath + profileImagePath);
							setCoverImagePath(filePath + coverImagePath);
							setBio(profileBio);
						}
					});
				setLoading(false);
			} catch (err) {
				enqueueSnackbar("Could not connect to the server", {
					variant: "error",
				});
				setLoading(false);
			}
		};
		fetchData();
	}, []);

	return (
		<div>
			{loading && <Spinner />}
			<img
				src={coverImagePath}
				alt="Profile cover photo"
				className="img-fluid rounded-5 w-100 mt-3"
			/>
			<div className="container-fluid my-3 rounded-3 pt-3">
				<div className="row align-items-center justify-content-around shadow-lg rounded-3 py-3 bg-light">
					<div className="col-sm-5 col-7 d-flex flex-column align-items-center justify content-center">
						<img
							src={profileImagePath}
							alt="Profile picture"
							className="img-fluid rounded-circle w-75"
							style={{ maxWidth: "300px" }}
						/>
						<p className={`${windowWidth > 500 ? "h2" : "h6"} my-3`}>{name}</p>
					</div>
					<div className="col-sm-4 col-5 d-flex flex-column">
						<div className="container">
							<div className="row gy-3 flex-column">
								<button
									className="btn btn-success col-11"
									style={{
										fontSize:
											windowWidth > 700
												? "20px"
												: windowWidth > 500
												? "16px"
												: "12px",
									}}
									onClick={() => navigate(`/profile/edit-profile/${userId}`)}
								>
									Edit Profile
								</button>
								<button
									className="btn btn-primary col-11"
									style={{
										fontSize:
											windowWidth > 700
												? "20px"
												: windowWidth > 500
												? "16px"
												: "12px",
									}}
									onClick={() =>
										setShowAddNewPostForm((prevState) => !prevState)
									}
								>
									Add New Post
								</button>
								<button
									className="btn btn-secondary col-11"
									style={{
										fontSize:
											windowWidth > 700
												? "20px"
												: windowWidth > 500
												? "16px"
												: "12px",
									}}
									onClick={() => navigate(`/profile/view-friends/${userId}`)}
								>
									View Friends
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
			<hr />
			<p className="shadow bg-light py-3 px-2 rounded-3">{bio}</p>
		</div>
	);
};

export default UserProfile;

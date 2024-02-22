import { React, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Spinner from "../../../components/Spinner.jsx";
import { useSnackbar } from "notistack";
import {
	setName,
	setProfileImagePath,
	setCoverImagePath,
	setBio,
	setLoading,
	setShowAddNewPostForm,
} from "../features/userProfileSlice.js";
import { ServerContext } from "../../../App.js";

const UserProfile = () => {
	const dispatch = useDispatch();
	const {
		name,
		profileImagePath,
		coverImagePath,
		bio,
		loading,
		showAddNewPostForm,
	} = useSelector((store) => store.userProfile);
	const { user, token } = useSelector((store) => store.auth);
	const navigate = useNavigate();
	const serverURL = useContext(ServerContext);
	const { enqueueSnackbar } = useSnackbar();

	const filePath = `${serverURL}/public/images/profile/`;

	useEffect(() => {
		const fetchData = async () => {
			dispatch(setLoading(true));
			try {
				const res = await fetch(`${serverURL}/profile`, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
					body: JSON.stringify({
						userId: user._id,
					}),
				});

				if (!res.ok) {
					if (res.status == 403) {
						enqueueSnackbar("Access Denied", {
							variant: "error",
						});
					} else {
						enqueueSnackbar("Server Error", {
							variant: "error",
						});
					}
					return;
				}

				const { msg, userInfo } = await res.json();

				if (msg === "User not found") {
					enqueueSnackbar("User not found", {
						variant: "error",
					});
				} else if (msg === "Success") {
					const name = userInfo.userName;

					const userProfile = userInfo.userProfile;
					const profileImagePath = userProfile.profileImagePath;
					const coverImagePath = userProfile.profileCoverImagePath;
					const profileBio = userProfile.profileBio;
					dispatch(setName(name));
					dispatch(setProfileImagePath(filePath + profileImagePath));
					dispatch(setCoverImagePath(filePath + coverImagePath));
					dispatch(setBio(profileBio));
				}
				dispatch(setLoading(false));
			} catch (err) {
				enqueueSnackbar("Could not connect to the server", {
					variant: "error",
				});
				dispatch(setLoading(false));
			}
		};
		fetchData();
	}, []);

	return (
		<div>
			{/* {loading && <Spinner />} */}
			<img
				src={coverImagePath}
				alt="Profile cover photo"
				className="rounded-xl w-full mt-3"
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
						<p className={`my-3`}>{name}</p>
					</div>
					<div className="col-sm-4 col-5 d-flex flex-column">
						<div className="container">
							<div className="row gy-3 flex-column">
								<button
									className="btn btn-success col-11"
									onClick={() => navigate("/profile/edit-profile")}
								>
									Edit Profile
								</button>
								<button
									className="btn btn-primary col-11"
									onClick={() =>
										dispatch(setShowAddNewPostForm(!showAddNewPostForm))
									}
								>
									Add New Post
								</button>
								<button
									className="btn btn-secondary col-11"
									onClick={() => navigate("/profile/view-friends")}
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

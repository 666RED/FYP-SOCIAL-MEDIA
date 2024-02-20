import { React, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import BackArrow from "../../components/BackArrow.jsx";
import { useSnackbar } from "notistack";
import Spinner from "../../components/Spinner.jsx";

const EditProfile = () => {
	const userId = useParams().userId;
	const navigate = useNavigate();
	const [windowWidth, setWindowWidth] = useState(window.innerWidth);
	const [profileImagePath, setProfileImagePath] = useState("");
	const [coverImagePath, setCoverImagePath] = useState("");
	const [profileImage, setProfileImage] = useState();
	const [coverImage, setCoverImage] = useState();
	const [bio, setBio] = useState("");
	const { enqueueSnackbar } = useSnackbar();
	const [loading, setLoading] = useState(false);
	const [toggleEdit, setToggleEdit] = useState(true);
	const filePath =
		"https://fyp-social-media.onrender.com/public/images/profile/";

	useEffect(() => {
		const handleResize = () => {
			setWindowWidth(window.innerWidth);
		};

		window.addEventListener("resize", handleResize);

		return () => {
			window.removeEventListener("resize", handleResize);
		};
	}, [windowWidth]);

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
							const profile = user.userProfile.profileObj;
							setProfileImagePath(filePath + profile.profileImagePath);
							setCoverImagePath(filePath + profile.profileCoverImagePath);
							setBio(profile.profileBio);
						}
					});
				setLoading(false);
			} catch (err) {
				enqueueSnackbar("Could not connect to server", {
					variant: "error",
				});
				setLoading(false);
			}
		};
		fetchData();
	}, []);

	const handleSave = async () => {
		try {
			setLoading(true);
			const formdata = new FormData();
			formdata.append("profileImage", profileImage);
			formdata.append("coverImage", coverImage);
			formdata.append("userId", userId);
			formdata.append("bio", bio);

			await fetch(
				"https://fyp-social-media.onrender.com/profile/edit-profile",
				{
					method: "POST",
					body: formdata,
				}
			)
				.then((res) => res.json())
				.then((data) => {
					if (data.msg === "User not found") {
						enqueueSnackbar("User not found", {
							variant: "error",
						});
					} else if (data.msg === "Success") {
						enqueueSnackbar("Profile updated", {
							variant: "success",
						});
						navigate(`/profile/${userId}`);
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

	const handleProfileImageChange = (event) => {
		const file = event.target.files[0];

		if (file) {
			const image = new Image();

			image.onload = () => {
				// Check if the image is square
				if (Math.abs(image.width - image.height) < 30) {
					setProfileImagePath(URL.createObjectURL(file));
					setProfileImage(file);
				} else {
					enqueueSnackbar("Please choose a square image", {
						variant: "warning",
					});
				}
			};

			image.src = URL.createObjectURL(file);
		}
	};

	const handleCoverImageChange = (event) => {
		const file = event.target.files[0];

		if (file) {
			setCoverImagePath(URL.createObjectURL(file));
			setCoverImage(file);
		}
	};

	return (
		<div
			className={`${
				windowWidth > 1000 ? "container w-75" : "container-fluid"
			} my-3`}
		>
			{loading && <Spinner />}
			<div>
				<BackArrow destination={`/profile/${userId}`} />
			</div>
			<div className="container-fluid">
				<div className="row">
					<div className="col-12">
						<div className="d-flex align-items-center justify-content-between mb-3">
							<h3 className="m-0">Profile Picture</h3>
							<label
								htmlFor="profileImageInput"
								className="fs-3 text-primary m-0"
								style={{ cursor: "pointer" }}
							>
								Edit
							</label>
							<input
								type="file"
								id="profileImageInput"
								accept="image/*"
								style={{ display: "none" }}
								onChange={handleProfileImageChange}
							/>
						</div>
						<img
							src={profileImagePath}
							alt="Profile image"
							className="img-fluid rounded-circle
              w-25 mx-auto d-block"
						/>
					</div>
					<hr className="my-3" />
					<div className="col-12">
						<div className="d-flex align-items-center justify-content-between mb-3">
							<h3 className="m-0">Cover Image</h3>
							<label
								htmlFor="coverImageInput"
								className="fs-3 text-primary m-0"
								style={{ cursor: "pointer" }}
							>
								Edit
							</label>
							<input
								type="file"
								// width={}
								id="coverImageInput"
								accept="image/*"
								style={{ display: "none" }}
								onChange={handleCoverImageChange}
							/>
						</div>
						<img src={coverImagePath} alt="Cover image" className="img-fluid" />
					</div>
					<hr className="my-3" />
					<div className="col-12">
						<div className="d-flex align-items-center justify-content-between mb-3">
							<h3 className="m-0">Bio</h3>
							<p
								className="fs-3 text-primary m-0"
								style={{ cursor: "pointer" }}
								onClick={() => setToggleEdit(!toggleEdit)}
							>
								Edit
							</p>
						</div>
						{/* <p>{bio}</p> */}
						<textarea
							rows="4"
							style={{ resize: "none" }}
							className="border-secondary border py-1 px-2 rounded-3 w-100"
							readOnly={toggleEdit}
							disabled={toggleEdit}
							value={bio}
							onChange={(e) => setBio(e.target.value)}
						/>
					</div>
				</div>
			</div>
			<button
				className="btn btn-success mt-3 fs-4 d-block mx-auto px-4"
				onClick={handleSave}
			>
				SAVE
			</button>
		</div>
	);
};

export default EditProfile;

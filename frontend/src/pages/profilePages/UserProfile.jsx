import { React, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import BackArrow from "../../components/BackArrow.jsx";
import UserProfile from "../../components/UserProfile.jsx";
import UserPost from "../../components/UserPost.jsx";
import AddNewPostForm from "../../components/AddNewPostForm.jsx";

const Profile = () => {
	const userId = useParams().userId;
	const [windowWidth, setWindowWidth] = useState(window.innerWidth);
	const [showAddNewPostForm, setShowAddNewPostForm] = useState(false);
	const [postAdded, setPostAdded] = useState(false);

	useEffect(() => {
		const handleResize = () => {
			setWindowWidth(window.innerWidth);
		};

		window.addEventListener("resize", handleResize);

		return () => {
			window.removeEventListener("resize", handleResize);
		};
	}, [windowWidth]);

	return (
		<div
			className={`${
				windowWidth > 1000 ? "container w-75" : "container-fluid"
			} pt-2 pb-4`}
			style={{ backgroundColor: "#F1EFEF" }}
		>
			{showAddNewPostForm && (
				<AddNewPostForm
					setShowAddNewPostForm={setShowAddNewPostForm}
					userId={userId}
					setPostAdded={setPostAdded}
				/>
			)}
			<div>
				<BackArrow destination={`/home/${userId}`} />
			</div>
			<UserProfile
				windowWidth={windowWidth}
				userId={userId}
				setShowAddNewPostForm={setShowAddNewPostForm}
			/>
			<hr />
			<UserPost userId={userId} postAdded={postAdded} />
		</div>
	);
};

export default Profile;

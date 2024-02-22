import { React, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import BackArrow from "../../components/BackArrow.jsx";
import HorizontalRule from "../../components/HorizontalRule.jsx";
import UserProfile from "./components/UserProfile.jsx";
import UserPost from "./components/UserPost.jsx";
import AddNewPostForm from "./components/AddNewPostForm.jsx";

const Profile = () => {
	const dispatch = useDispatch();
	const { user, token } = useSelector((store) => store.auth);

	const [showAddNewPostForm, setShowAddNewPostForm] = useState(false);
	const [postAdded, setPostAdded] = useState(false);

	if (!user) {
		return <div>Access Denied</div>;
	}

	return (
		<div className="pt-2 pb-4 bg-gray-200">
			{/* {showAddNewPostForm && (
				<AddNewPostForm
					setShowAddNewPostForm={setShowAddNewPostForm}
					setPostAdded={setPostAdded}
				/>
			)} */}
			<div>
				<BackArrow destination={"/home"} />
			</div>
			<UserProfile />
			<HorizontalRule />
			{/* <UserPost postAdded={postAdded} /> */}
		</div>
	);
};

export default Profile;

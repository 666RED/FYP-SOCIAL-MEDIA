import { React, useState, useEffect, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import UserProfile from "./components/userProfile/UserProfile.jsx";
import UserPosts from "./components/userPost/UserPosts.jsx";
import AddNewPostForm from "./components/userProfile/AddNewPostForm.jsx";
import SideBar from "../../components/Sidebar/SideBar.jsx";
import Header from "../../components/Header.jsx";
import Error from "../../components/Error.jsx";
import { clearState } from "./features/userProfilePageSlice.js";

const Profile = () => {
	const dispatch = useDispatch();

	const { user, token } = useSelector((store) => store.auth);
	const { showAddNewPostForm } = useSelector((store) => store.userProfilePage);

	const [extendSideBar, setExtendSideBar] = useState(false);

	useEffect(() => {
		return () => {
			dispatch(clearState());
		};
	}, [dispatch]);

	return user && token ? (
		<div className="py-2">
			{/* ADD NEW POST FORM */}
			{showAddNewPostForm && <AddNewPostForm />}
			{/* SIDEBAR */}
			{extendSideBar && (
				<SideBar
					selectedSection="Profile"
					setExtendSideBar={setExtendSideBar}
				/>
			)}
			{/* HEADER */}
			<Header
				extendSideBar={extendSideBar}
				setExtendSideBar={setExtendSideBar}
				title="Profile"
			/>
			{/* USER PROFILE */}
			<UserProfile />
			<hr className="border-4 border-gray-400" />
			{/* USER POSTS */}
			<UserPosts />
		</div>
	) : (
		<Error />
	);
};

export default Profile;

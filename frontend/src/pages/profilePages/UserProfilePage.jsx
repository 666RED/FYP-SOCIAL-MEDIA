import { React, useState, useEffect, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import HorizontalRule from "../../components/HorizontalRule.jsx";
import UserProfile from "./components/UserProfile.jsx";
import UserPosts from "./components/UserPosts.jsx";
import AddNewPostForm from "./components/AddNewPostForm.jsx";
import SideBar from "../../components/Sidebar/SideBar.jsx";
import Header from "../../components/Header.jsx";
import Error from "../../components/Error.jsx";
import {
	setLoading,
	clearState,
	setShowAddNewPostForm,
} from "./features/userProfilePageSlice.js";
import { useSnackbar } from "notistack";
import { ServerContext } from "../../App.js";

const Profile = () => {
	const dispatch = useDispatch();
	const { enqueueSnackbar } = useSnackbar();
	const serverURL = useContext(ServerContext);

	const { user, token } = useSelector((store) => store.auth);
	const { showAddNewPostForm } = useSelector((store) => store.userProfilePage);

	const [postAdded, setPostAdded] = useState(false);
	const [extendSideBar, setExtendSideBar] = useState(false);

	useEffect(() => {
		return () => {
			dispatch(clearState());
		};
	}, [dispatch]);

	return user && token ? (
		<div className="py-2">
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
			<UserProfile />
			<hr className="border-4 border-gray-400" />
			<UserPosts />
		</div>
	) : (
		<Error />
	);
};

export default Profile;

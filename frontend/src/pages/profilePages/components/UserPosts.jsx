import { React, useEffect, useContext, createContext, useReducer } from "react";
import { useSelector } from "react-redux";
import Post from "./UserPost.jsx";
import Loader from "../../../components/Loader.jsx";
import { ServerContext } from "../../../App.js";
import { enqueueSnackbar } from "notistack";
import {
	userPostsReducer,
	INITIAL_STATE,
} from "../features/userPosts/userPostsReducer.js";
import { ACTION_TYPES } from "../actionTypes/userPosts/userPostsActionTypes.js";

const UserPosts = () => {
	const serverURL = useContext(ServerContext);
	const { user, token } = useSelector((store) => store.auth);
	const { postAdded } = useSelector((store) => store.userProfilePage);
	const [state, dispatch] = useReducer(userPostsReducer, INITIAL_STATE);

	useEffect(() => {
		const getPost = async () => {
			try {
				dispatch({ type: ACTION_TYPES.SET_LOADING, payload: true });

				const res = await fetch(`${serverURL}/post/get-posts`, {
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
					if (res.status === 403) {
						enqueueSnackbar("Access Denied", { variant: "error" });
					} else {
						enqueueSnackbar("Server Error", { variant: "error" });
					}
					return;
				}

				const { msg, posts } = await res.json();

				if (msg === "No post") {
					dispatch({ type: ACTION_TYPES.SET_HAS_POST, payload: false });
				} else if (msg === "Success") {
					dispatch({
						type: ACTION_TYPES.SET_POSTS,
						payload: posts.map((post, id) => <Post key={id} post={post} />),
					});
					dispatch({ type: ACTION_TYPES.SET_HAS_POST, payload: true });
				}
				dispatch({ type: ACTION_TYPES.SET_LOADING, payload: false });
			} catch (err) {
				console.log(err);

				enqueueSnackbar("Could not connect to the server", {
					variant: "error",
				});
				dispatch({ type: ACTION_TYPES.SET_LOADING, payload: false });
			}
		};
		getPost();
	}, [postAdded]);

	return (
		<div>
			{state.loading ? (
				<Loader />
			) : (
				<div className="bg-gray-200 w-full py-1 px-3">
					{state.hasPost ? (
						state.posts
					) : (
						<h2 className="text-center my-2">No post</h2>
					)}
				</div>
			)}
		</div>
	);
};

export default UserPosts;

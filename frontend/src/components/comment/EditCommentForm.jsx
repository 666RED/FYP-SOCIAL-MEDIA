import { React, useState, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSnackbar } from "notistack";
import Filter from "../Filter.jsx";
import FormHeader from "../FormHeader.jsx";
import Spinner from "../Spinner/Spinner.jsx";
import { updateComment } from "./feature/commentSlice.js";
import { ServerContext } from "../../App.js";

const EditCommentForm = ({
	toggleEditCommentForm,
	comment,
	toggleShowOptions,
}) => {
	const [currentComment, setCurrentComment] = useState(
		comment.commentDescription
	);
	const [hasChanged, setHasChanged] = useState(false);
	const [loading, setLoading] = useState(false);
	const serverURL = useContext(ServerContext);
	const { token } = useSelector((store) => store.auth);
	const { enqueueSnackbar } = useSnackbar();
	const sliceDispatch = useDispatch();

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (currentComment.trim() === "") {
			enqueueSnackbar("Please enter your comment", { variant: "warning" });
			return;
		}
		setLoading(true);
		try {
			const res = await fetch(`${serverURL}/comment/edit-comment`, {
				method: "PATCH",
				body: JSON.stringify({
					commentId: comment._id,
					newComment: currentComment.trim(),
				}),
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			});

			if (!res.ok && res.status === 403) {
				setLoading(false);
				enqueueSnackbar("Access Denied", { variant: "error" });
				return;
			}

			const { msg, updatedComment } = await res.json();

			if (msg === "Success") {
				sliceDispatch(updateComment(updatedComment));
				toggleEditCommentForm();
				toggleShowOptions();
				enqueueSnackbar("Comment edited", { variant: "success" });
			} else if (msg === "Fail to update comment") {
				enqueueSnackbar("Fail to edit comment", {
					variant: "error",
				});
			} else {
				enqueueSnackbar("An error occurred", { variant: "error" });
			}

			setLoading(false);
		} catch (err) {
			enqueueSnackbar("Could not connect to the server", {
				variant: "error",
			});
			setLoading(false);
		}
	};

	return (
		<div>
			{loading && <Spinner />}
			<Filter />
			<div className="center-container items-center">
				<form onSubmit={handleSubmit} className="form">
					<FormHeader
						title="Edit Comment"
						closeFunction={toggleEditCommentForm}
						discardChanges={hasChanged}
					/>
					<input
						required
						max={200}
						type="text"
						value={currentComment}
						onChange={(e) => {
							setCurrentComment(e.target.value);
							setHasChanged(true);
						}}
						className="w-full border border-gray-600 p-2 my-4"
					/>
					<button className="btn-green block w-50 mx-auto py-2 px-5 mt-4">
						EDIT
					</button>
				</form>
			</div>
		</div>
	);
};

export default EditCommentForm;

import { React, useState, useEffect } from "react";
import { MdCancel } from "react-icons/md/index.js";
import Spinner from "../../../components/Spinner.jsx";
import UploadImage from "../../../components/UploadImage.jsx";
import { useSnackbar } from "notistack";

const AddNewPostForm = ({ setShowAddNewPostForm, userId, setPostAdded }) => {
	const { enqueueSnackbar } = useSnackbar();
	const [loading, setLoading] = useState(false);
	const [text, setText] = useState("");
	const [imagePath, setImagePath] = useState("");
	const [image, setImage] = useState();

	const handleSubmit = async (e) => {
		try {
			e.preventDefault();
			setLoading(true);
			const formdata = new FormData();
			formdata.append("text", text);
			formdata.append("image", image);
			formdata.append("userId", userId);

			await fetch("https://fyp-social-media.onrender.com/post/add-new-post", {
				method: "POST",
				body: formdata,
			})
				.then((res) => res.json())
				.then((data) => {
					enqueueSnackbar("New post added", {
						variant: "success",
					});
					setShowAddNewPostForm(false);
					setPostAdded((prevState) => !prevState);
				});
			setLoading(false);
		} catch (err) {
			enqueueSnackbar("Could not connect to the server", {
				variant: "error",
			});
			setLoading(false);
		}
	};

	const handleScroll = (e) => {
		e.stopPropagation();
	};

	return (
		<div>
			{loading && <Spinner />}
			<div className="z-1 position-fixed top-0 bottom-0 start-0 end-0 bg-dark opacity-75"></div>
			<div className="z-2 position-fixed top-0 bottom-0 start-0 end-0 d-flex align-items-center justify-content-center">
				<form
					onSubmit={handleSubmit}
					className="container bg-white form p-3 border-secondary border rounded-5 position-absolute w-75 add-new-post-container"
					style={{ minWidth: "340px", maxHeight: "650px", overflowY: "auto" }}
				>
					<div className="add-new-post-content position-relative">
						<h1 className="text-center">Add new post</h1>
						<MdCancel
							className="position-absolute top-0  mt-2 fs-1 text-danger cancel-icon"
							onClick={() => setShowAddNewPostForm(false)}
						/>
						<hr />
						{/* TEXT */}
						<label htmlFor="text-description" className="form-label">
							Text description:
						</label>
						<textarea
							onScroll={handleScroll}
							type="text"
							id="text-description"
							value={text}
							onChange={(e) => setText(e.target.value)}
							className={`form-control py-2 d-inline border-secondary`}
							rows={6}
							maxLength={2000}
							style={{ resize: "none" }}
						/>
						{/* IMAGE */}
						<label className="form-label mt-3">Image:</label>
						<UploadImage
							setImagePath={setImagePath}
							imagePath={imagePath}
							setImage={setImage}
						/>

						{/* SUBMIT BUTTON */}
						<button className="btn btn-success d-block w-50 mx-auto p-2 fs-5 mt-4">
							SUBMIT
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default AddNewPostForm;

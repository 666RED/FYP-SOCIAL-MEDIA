import { React, useEffect, useState, useContext } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useSnackbar } from "notistack";
import { TiTick } from "react-icons/ti";
import Spinner from "../../../../../components/Spinner/Spinner.jsx";
import Title from "../smallComponents/Title.jsx";
import { setUser } from "../../../../../features/authSlice.js";
import { ServerContext } from "../../../../../App.js";
import { SettingContext } from "../../SettingMainPage.jsx";

const FramePreference = () => {
	const { user, token } = useSelector((store) => store.auth);
	const sliceDispatch = useDispatch();
	const { setOption, setDiscardChanges } = useContext(SettingContext);
	const serverURL = useContext(ServerContext);
	const { enqueueSnackbar } = useSnackbar();

	const [loading, setLoading] = useState(false);
	const [selectedId, setSelectedId] = useState("");

	const profileImgPath = `${serverURL}/public/images/profile/`;

	const frames = [
		{ id: 0, name: "Default", frameColor: "none" },
		{ id: 1, name: "Blue", frameColor: "border-blue-500" },
		{ id: 2, name: "Green", frameColor: "border-green-500" },
		{ id: 3, name: "Yellow", frameColor: "border-yellow-500" },
		{ id: 4, name: "Pink", frameColor: "border-pink-500" },
		{ id: 5, name: "Purple", frameColor: "border-purple-500" },
	];

	// first render
	useEffect(() => {
		setSelectedId(
			frames.find(
				(frame) => frame.frameColor === user.userProfile.profileFrameColor
			).id
		);
	}, []);

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			setLoading(true);

			const selectedFrame = frames.find((frame) => frame.id === selectedId);

			const res = await fetch(`${serverURL}/setting/apply-frame`, {
				method: "PATCH",
				body: JSON.stringify({
					userId: user._id,
					frameColor: selectedFrame.frameColor,
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

			const { msg, updatedUser } = await res.json();

			if (msg === "Success") {
				sliceDispatch(setUser({ user: updatedUser, token: token }));
				enqueueSnackbar("New frame applied", {
					variant: "success",
				});
				setOption("");
			} else if (msg === "Fail to apply new frame") {
				enqueueSnackbar("Fail to apply new frame", {
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

	const handleOnClick = (id) => {
		setSelectedId(id);
	};

	return (
		<form onSubmit={handleSubmit}>
			{loading && <Spinner />}
			{/* TITLE */}
			<Title title="Frame preference" />
			{/* FRAMES */}
			<div className="grid grid-cols-12 gap-y-4 mt-3">
				{frames.map((frame) => (
					<div
						className="col-span-6 md:col-span-4 lg:col-span-3 flex flex-col items-center relative"
						key={frame.id}
					>
						{/* PROFILE IMAGE */}
						<img
							alt="Profile image"
							src={`${profileImgPath}${user.userProfile.profileImagePath}`}
							className={`max-w-32 rounded-full cursor-pointer hover:opacity-70 border-4 ${frame.frameColor}`}
							onClick={() => handleOnClick(frame.id)}
						/>
						{/* NAME */}
						<p>{frame.name}</p>
						{/* TICK ICON */}
						{selectedId === frame.id && (
							<TiTick className="bg-blue-700 text-white rounded-full text-xl absolute top-1 right-[10%]" />
						)}
					</div>
				))}
			</div>
			{/* APPLY BUTTON */}
			<button className="btn-green block mx-auto mt-7 md:w-1/3 w-1/2">
				APPLY
			</button>
		</form>
	);
};

export default FramePreference;

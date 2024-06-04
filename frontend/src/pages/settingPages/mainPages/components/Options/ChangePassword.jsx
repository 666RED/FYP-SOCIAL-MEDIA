import { React, useContext, useState } from "react";
import { useSelector } from "react-redux";
import { useSnackbar } from "notistack";
import { BsEyeFill, BsEyeSlashFill } from "react-icons/bs";
import Spinner from "../../../../../components/Spinner/Spinner.jsx";
import Title from "../smallComponents/Title.jsx";
import { ServerContext } from "../../../../../App.js";
import { SettingContext } from "../../SettingMainPage.jsx";

const ChangePassword = () => {
	const { user, token } = useSelector((store) => store.auth);
	const { setOption, setDiscardChanges } = useContext(SettingContext);
	const serverURL = useContext(ServerContext);
	const { enqueueSnackbar } = useSnackbar();

	const [loading, setLoading] = useState(false);
	const [oldPassword, setOldPassword] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [viewPassword, setViewPassword] = useState(false);
	const [verifiedOldPassword, setVerifiedOldPassword] = useState(false);

	const toggleViewPassword = () => {
		setViewPassword((prev) => !prev);
	};

	const handleNext = async (e) => {
		e.preventDefault();
		try {
			setLoading(true);

			const res = await fetch(`${serverURL}/setting/verify-old-password`, {
				method: "POST",
				body: JSON.stringify({ oldPassword: oldPassword, userId: user._id }),
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

			const { msg } = await res.json();

			if (msg === "Success") {
				setVerifiedOldPassword(true);
				document.querySelector("#old-password").disabled = true;
			} else if (msg === "Not exist") {
				enqueueSnackbar("User not exist", {
					variant: "error",
				});
			} else if (msg === "Invalid credentials") {
				enqueueSnackbar("Invalid credentials", {
					variant: "error",
				});
				document.querySelector("#old-password").focus();
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

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			setLoading(true);

			if (confirmPassword !== newPassword) {
				enqueueSnackbar("Passwords does not match", {
					variant: "warning",
				});
				document.querySelector("#new-password").focus();
				setLoading(false);
				return;
			}

			const res = await fetch(`${serverURL}/setting/change-password`, {
				method: "PATCH",
				body: JSON.stringify({
					userId: user._id,
					password: newPassword,
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

			const { msg } = await res.json();

			if (msg === "Success") {
				enqueueSnackbar("Password changed", {
					variant: "success",
				});
				setOption("");
			} else if (msg === "User not found") {
				enqueueSnackbar("Fail to change password", {
					variant: "success",
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
		<form onSubmit={verifiedOldPassword ? handleSubmit : handleNext}>
			{loading && <Spinner />}
			{/* TITLE */}
			<Title title="Change password" />
			<label htmlFor="old-password">Enter your old password:</label>
			<div className="relative w-1/2">
				{/* FILTER */}
				{verifiedOldPassword && (
					<div className="absolute top-0 bottom-0 left-0 right-0 bg-gray-100 z-30 opacity-50"></div>
				)}
				{/* OLD PASSWORD */}
				<input
					type={viewPassword ? "text" : "password"}
					id="old-password"
					minLength={8}
					maxLength={30}
					value={oldPassword}
					onChange={(e) => {
						setOldPassword(e.target.value);
						setDiscardChanges(true);
					}}
					className="w-full mt-2 pr-8"
					placeholder="Old password"
					required
				/>
				{/* EYE ICONS */}
				{viewPassword ? (
					<BsEyeSlashFill
						className="absolute text-xl top-6 right-2 cursor-pointer hover:text-blue-600 icon"
						onClick={toggleViewPassword}
					/>
				) : (
					<BsEyeFill
						className="absolute text-xl top-6 right-2 cursor-pointer hover:text-blue-600 icon"
						onClick={toggleViewPassword}
					/>
				)}
			</div>
			{/* NEXT BUTTON */}
			{!verifiedOldPassword && (
				<button
					className="btn-gray block mx-auto w-1/2 md:w-1/3 mt-4"
					type="submit"
				>
					NEXT
				</button>
			)}
			{/* NEW PASSWORD & CONFIRM PASSWORD*/}
			{verifiedOldPassword && (
				<div className="mt-3">
					<label className="block">
						Enter new password & confirm password:
					</label>
					{/* NEW PASSWORD */}
					<input
						type="password"
						id="new-password"
						minLength={8}
						maxLength={30}
						value={newPassword}
						onChange={(e) => setNewPassword(e.target.value)}
						className="w-1/2 block mt-2 pr-8"
						placeholder="New password"
						required
					/>
					{/* CONFIRM PASSWORD */}
					<input
						type="password"
						id="CONFIRM-password"
						minLength={8}
						maxLength={30}
						value={confirmPassword}
						onChange={(e) => setConfirmPassword(e.target.value)}
						className="w-1/2 block mt-2 pr-8"
						placeholder="Confirm password"
						required
					/>
					{/* SUBMIT BUTTON */}
					<button
						type="submit"
						className="btn-green block mx-auto w-1/2 md:w-1/3 mt-5"
					>
						SUBMIT
					</button>
				</div>
			)}
		</form>
	);
};

export default ChangePassword;

import { React, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import BackArrow from "../../components/BackArrow.jsx";
import Spinner from "../../components/Spinner.jsx";
import { useSnackbar } from "notistack";

const ResetPassword = () => {
	const userId = useParams().userId;
	const [newPassword, setNewPassword] = useState("");
	const [validNewPassword, setValidNewPassword] = useState(true);
	const [confirmPassword, setConfirmPassword] = useState("");
	const [validConfirmPassword, setValidConfirmPassword] = useState(true);
	const [loading, setLoading] = useState(false);
	const { enqueueSnackbar } = useSnackbar();
	const navigate = useNavigate();

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		try {
			if (newPassword !== confirmPassword) {
				enqueueSnackbar("Not matched", {
					variant: "error",
				});
				setValidNewPassword(false);
				setValidConfirmPassword(false);
			} else {
				await fetch(
					`https://fyp-fsktm-connect.onrender.com/recover-password/reset-password`,
					{
						method: "POST",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify({
							userId: userId,
							newPassword: newPassword,
						}),
					}
				)
					.then((res) => res.json())
					.then((data) => {
						if (data.msg === "User not found") {
							enqueueSnackbar("User not found", {
								variant: "error",
							});
						} else if (data.msg === "Success") {
							enqueueSnackbar("Password reset", {
								variant: "success",
							});
							setValidNewPassword(true);
							setValidConfirmPassword(true);
							navigate("/");
						}
					});
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
		<div className="position-absolute top-0 bottom-0 start-0 end-0 d-flex justify-content-center align-items-center">
			{loading && <Spinner />}
			<form
				className="form border border-secondary rounded-4 p-3"
				style={{ maxWidth: "340px" }}
				onSubmit={handleSubmit}
			>
				<div className="d-flex align-items-center justify-content-center position-relative">
					<div className="position-absolute start-0">
						<BackArrow destination={`/recover-password/auth/${userId}`} />
					</div>
					<h3 className="text-center m-0">Reset Password</h3>
				</div>
				<hr />
				<p className="text-center">Enter new password and confirm password</p>
				<input
					type="password"
					className={`form-control ${
						validNewPassword ? "border-secondary" : "border-danger"
					}`}
					placeholder="New password"
					minLength={8}
					required
					value={newPassword}
					onChange={(e) => setNewPassword(e.target.value)}
				/>
				<br />
				<input
					type="password"
					className={`form-control ${
						validConfirmPassword ? "border-secondary" : "border-danger"
					}`}
					placeholder="Confirm password"
					minLength={8}
					required
					value={confirmPassword}
					onChange={(e) => setConfirmPassword(e.target.value)}
				/>
				<p className="mt-1 ms-2">At least 8 characters</p>
				<button className="btn btn-primary d-block mx-auto w-25 mt-4">
					Reset
				</button>
			</form>
		</div>
	);
};

export default ResetPassword;

import { React, useContext, useReducer } from "react";
import { useParams, useNavigate } from "react-router-dom";
import BackArrow from "../../components/BackArrow.jsx";
import Spinner from "../../components/Spinner.jsx";
import HorizontalRule from "../../components/HorizontalRule.jsx";
import { useSnackbar } from "notistack";
import {
	resetPasswordReducer,
	INITIAL_STATE,
} from "./features/resetPasswordReducer.js";
import { ACTION_TYPES } from "./actionTypes/resetPasswordActionTypes.js";
import { ServerContext } from "../../App.js";

const ResetPassword = () => {
	const serverURL = useContext(ServerContext);

	const userId = useParams().userId;
	const { enqueueSnackbar } = useSnackbar();
	const navigate = useNavigate();
	const [state, dispatch] = useReducer(resetPasswordReducer, INITIAL_STATE);

	const handleSubmit = async (e) => {
		e.preventDefault();
		dispatch({ type: ACTION_TYPES.SET_LOADING, payload: true });
		try {
			if (state.newPassword !== state.confirmPassword) {
				dispatch({ type: ACTION_TYPES.SET_VALID_PASSWORDS, payload: false });
				enqueueSnackbar("Not matched", {
					variant: "error",
				});
			} else {
				await fetch(`${serverURL}/recover-password/reset-password`, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						userId: userId,
						newPassword: state.newPassword,
					}),
				})
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
							dispatch({
								type: ACTION_TYPES.SET_VALID_PASSWORDS,
								payload: false,
							});
							navigate("/");
						}
					});
			}
			dispatch({ type: ACTION_TYPES.SET_LOADING, payload: false });
		} catch (err) {
			enqueueSnackbar("Could not connect to the server", {
				variant: "error",
			});
			dispatch({ type: ACTION_TYPES.SET_LOADING, payload: false });
		}
	};

	return (
		<div className="main-container">
			{state.loading && <Spinner />}
			<form className="form-container max-w-lg" onSubmit={handleSubmit}>
				<div className="relative">
					<div className="absolute left-0 top-1">
						<BackArrow destination={`/recover-password/auth/${userId}`} />
					</div>
					<h2 className="text-center font-semibold">Reset Password</h2>
				</div>
				<HorizontalRule />
				<p className="text-center">Enter new password and confirm password</p>
				<input
					type="password"
					className={`border w-full rounded-lg my-3 ${
						state.validNewPassword ? "border-gray-500" : "border-red-500"
					}`}
					placeholder="New password"
					minLength={8}
					required
					value={state.newPassword}
					onChange={(e) =>
						dispatch({
							type: ACTION_TYPES.SET_NEW_PASSWORD,
							payload: e.target.value,
						})
					}
				/>
				<br />
				<input
					type="password"
					className={`border w-full rounded-lg my-3 ${
						state.validConfirmPassword ? "border-gray-500" : "border-red-500"
					}`}
					placeholder="Confirm password"
					minLength={8}
					required
					value={state.confirmPassword}
					onChange={(e) =>
						dispatch({
							type: ACTION_TYPES.SET_CONFIRM_PASSWORD,
							payload: e.target.value,
						})
					}
				/>
				<p className="mt-1 ml-2 text-sm text-gray-800">At least 8 characters</p>
				<button className="btn-blue block mx-auto w-1/2 mt-8">Reset</button>
			</form>
		</div>
	);
};

export default ResetPassword;

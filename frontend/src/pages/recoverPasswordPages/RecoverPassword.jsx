import { React, useContext, useReducer } from "react";
import { useNavigate } from "react-router-dom";
import BackArrow from "../../components/BackArrow.jsx";
import { useSnackbar } from "notistack";
import Spinner from "../../components/Spinner.jsx";
import HorizontalRule from "../../components/HorizontalRule.jsx";
import {
	recoverPasswordReducer,
	INITIAL_STATE,
} from "./features/recoverPasswordReducer.js";
import { ACTION_TYPES } from "./actionTypes/recoverPasswordActionTypes.js";
import { ServerContext } from "../../App.js";

const RecoverPassword = () => {
	const navigate = useNavigate();
	const [state, dispatch] = useReducer(recoverPasswordReducer, INITIAL_STATE);
	const { enqueueSnackbar } = useSnackbar();

	const serverURL = useContext(ServerContext);

	const handleSubmit = async (e) => {
		e.preventDefault();
		dispatch({ type: ACTION_TYPES.SET_LOADING, payload: true });
		try {
			await fetch(`${serverURL}/recover-password/auth-email`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					userEmailAddress: state.email.toLowerCase(),
				}),
			})
				.then((res) => res.json())
				.then((data) => {
					if (data.msg === "Not exist") {
						dispatch({ type: ACTION_TYPES.INVALID_EMAIL });
						enqueueSnackbar("User does not exist", { variant: "error" });
					} else if (data.msg === "Error") {
						dispatch({ type: ACTION_TYPES.INVALID_EMAIL });
						enqueueSnackbar("Some errors occurred", {
							variant: "error",
						});
					} else if (data.msg === "Success") {
						const userId = data.user._id;
						enqueueSnackbar("Please check your mailbox", {
							variant: "success",
						});
						navigate(`/recover-password/auth/${userId}`);
					}
					dispatch({ type: ACTION_TYPES.SET_LOADING, payload: false });
				});
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
			<form className="form-container" onSubmit={handleSubmit}>
				<div className="relative">
					<div className="absolute left-0 top-2">
						<BackArrow destination="/" />
					</div>
					<h2 className="text-center font-semibold">Recover Password</h2>
				</div>
				<HorizontalRule />
				<p className="text-base">
					Enter your registered email to get 6-digit verification code
				</p>
				<input
					type="email"
					minLength={20}
					maxLength={50}
					required
					className={`border w-full rounded-lg mt-4 ${
						state.validEmail ? "border-gray-500" : "border-red-500"
					}`}
					placeholder="Student / Staff Email Address"
					value={state.email}
					onChange={(e) =>
						dispatch({ type: ACTION_TYPES.SET_EMAIL, payload: e.target.value })
					}
				/>
				<button className="btn-blue mt-5 block w-full text-xl">SEND</button>
			</form>
		</div>
	);
};

export default RecoverPassword;

import { React, useContext, useReducer } from "react";
import { useNavigate } from "react-router-dom";
import FormBackArrowHeader from "../../components/BackArrow/FormBackArrowHeader.jsx";
import { useSnackbar } from "notistack";
import Spinner from "../../components/Spinner/Spinner.jsx";
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
			const res = await fetch(`${serverURL}/recover-password/auth-email`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					userEmailAddress: state.email.toLowerCase(),
				}),
			});

			const data = await res.json();

			if (data.msg === "Not exist") {
				dispatch({ type: ACTION_TYPES.INVALID_EMAIL });
				enqueueSnackbar("User does not exist", { variant: "error" });
			} else if (data.msg === "Error") {
				dispatch({ type: ACTION_TYPES.INVALID_EMAIL });
				enqueueSnackbar("An error occurred", {
					variant: "error",
				});
			} else if (data.msg === "Success") {
				const userId = data.user._id;
				enqueueSnackbar("Please check your mailbox", {
					variant: "success",
				});
				navigate(`/recover-password/auth/${userId}`);
			} else {
				enqueueSnackbar("An error occurred", {
					variant: "error",
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
			<form
				className="form-container"
				onSubmit={handleSubmit}
				autoComplete="on"
			>
				<FormBackArrowHeader destination="/" title="Recover Password" />
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

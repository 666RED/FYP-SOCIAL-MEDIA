import { React, useEffect, useContext, useReducer } from "react";
import { useParams } from "react-router-dom";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";
import FormBackArrowHeader from "../../components/BackArrow/FormBackArrowHeader.jsx";
import Spinner from "../../components/Spinner/Spinner.jsx";
import HorizontalRule from "../../components/HorizontalRule.jsx";
import { ServerContext } from "../../App.js";
import {
	authVerificationCodeReducer,
	INITIAL_STATE,
} from "./features/authVerificationCodeReducer.js";
import { ACTION_TYPES } from "./actionTypes/authVerificationCodeActionTypes.js";

const AuthVerificationCode = () => {
	const { enqueueSnackbar } = useSnackbar();
	const navigate = useNavigate();
	const [state, dispatch] = useReducer(
		authVerificationCodeReducer,
		INITIAL_STATE
	);
	const userId = useParams().userId;
	const serverURL = useContext(ServerContext);

	let timeoutId = null;
	const codeExpireTime = 60;

	useEffect(() => {
		const autoClearCodeRequest = async () => {
			try {
				const res = await fetch(
					`${serverURL}/recover-password/auto-clear-code`,
					{
						method: "POST",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify({ userId }),
					}
				);

				const data = await res.json();

				if (data.msg === "User not found") {
					console.log("User not found");
				} else if (data.msg === "Success") {
					console.log("Code has expired");
				} else {
					console.log("An error occurred");
				}
			} catch (error) {
				console.error("Error:", error);
			}
		};

		timeoutId = setTimeout(() => {
			autoClearCodeRequest();
		}, 5 * 60 * 1000); // 5 minutes in milliseconds

		// Clean up the timeout to prevent memory leaks
		return () => clearTimeout(timeoutId);
	}, [state.resend]);

	useEffect(() => {
		const countdown = () => {
			dispatch({
				type: ACTION_TYPES.SET_REMAINING_TIME,
				payload: state.remainingTime - 1,
			});
		};

		const countdownInterval = setInterval(countdown, 1000);

		if (state.remainingTime == 0) {
			const resendLink = document.getElementById("resend-link");
			resendLink.style.cursor = "pointer";
			clearInterval(countdownInterval);
		}

		return () => clearInterval(countdownInterval);
	}, [state.remainingTime]);

	const handleChange = (value) => {
		const reg = /[0-9]/;
		if (!reg.test(value.charAt(value.length - 1)) && value.length !== 0) {
			return state.code;
		} else {
			dispatch({ type: ACTION_TYPES.SET_CODE, payload: value });
		}
	};

	const handleReturn = async () => {
		try {
			const res = await fetch(`${serverURL}/recover-password/remove-code`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					userId: userId,
				}),
			});

			const data = await res.json();

			if (data.msg === "User not found") {
				console.log("User not found");
			} else if (data.msg === "Success") {
				console.log("Verification code is cleared");
			} else {
				console.log("An error occurred");
			}
		} catch (err) {
			enqueueSnackbar("Could not connect to the server", {
				variant: "error",
			});
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		try {
			dispatch({ type: ACTION_TYPES.SET_LOADING, payload: true });
			const res = await fetch(
				`${serverURL}/recover-password/auth-verification-code`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						userId: userId,
						verificationCode: state.code,
					}),
				}
			);

			const data = await res.json();

			if (data.msg === "Invalid code") {
				dispatch({ type: ACTION_TYPES.INVALID_CODE });
				enqueueSnackbar("Invalid code", {
					variant: "error",
				});
			} else if (data.msg === "Valid code") {
				navigate(`/recover-password/reset-password/${userId}`);
			} else if (data.msg === "User not found") {
				enqueueSnackbar("User not found", {
					variant: "error",
				});
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

	const handleResend = async () => {
		try {
			clearTimeout(timeoutId);
			dispatch({ type: ACTION_TYPES.SET_LOADING, payload: true });
			dispatch({
				type: ACTION_TYPES.SET_REMAINING_TIME,
				payload: codeExpireTime,
			});

			const res = await fetch(`${serverURL}/recover-password/resend-code`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					userId: userId,
				}),
			});

			const data = await res.json();

			if (data.msg === "User not found") {
				enqueueSnackbar("Some error occurred. Please go to previous page", {
					variant: "error",
				});
			} else if (data.msg === "Fail to set verification code") {
				enqueueSnackbar("An error occurred", {
					variant: "error",
				});
			} else if (data.msg === "Success") {
				enqueueSnackbar("Resent code", {
					variant: "success",
				});
			} else {
				enqueueSnackbar("An error occurred", {
					variant: "error",
				});
			}

			dispatch({ type: ACTION_TYPES.SET_LOADING, payload: false });
			dispatch({ type: ACTION_TYPES.SET_RESEND, paylaod: !state.resend });
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
			<form onSubmit={handleSubmit} className="form-container">
				<FormBackArrowHeader
					destination="/recover-password"
					title="Verify Code"
					func={handleReturn}
				/>
				<HorizontalRule />
				<p>Please enter 6-digit verification code</p>
				<input
					type="text"
					onChange={(e) => handleChange(e.target.value)}
					value={state.code}
					minLength={6}
					maxLength={6}
					required
					className={`border w-full rounded-xl my-3 ${
						state.validCode ? "border-gray-500" : "border-red-500"
					}`}
					placeholder="Verification code"
				/>
				<div
					className="flex items-center justify-between mb-3"
					id="resend-link"
				>
					<p
						className={`m-0 w-3/5 text-sm ${
							state.remainingTime === 0 ? "text-blue-500" : "text-gray-500"
						} fw-semibold`}
						onClick={state.remainingTime === 0 ? handleResend : null}
					>
						Resend verification code{" "}
						{state.remainingTime === 0 ? "" : `in ${state.remainingTime}s`}
					</p>
					<button className="btn-blue text-base">NEXT</button>
				</div>
			</form>
		</div>
	);
};

export default AuthVerificationCode;

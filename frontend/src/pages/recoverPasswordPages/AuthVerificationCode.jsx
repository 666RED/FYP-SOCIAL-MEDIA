import { React, useEffect, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";
import BackArrow from "../../components/BackArrow.jsx";
import Spinner from "../../components/Spinner.jsx";
import HorizontalRule from "../../components/HorizontalRule.jsx";
import { ServerContext } from "../../App.js";
import {
	setCode,
	setLoading,
	setValidCode,
	setResend,
	setRemainingTime,
} from "./features/authVerificationCode.js";

const AuthVerificationCode = () => {
	const { enqueueSnackbar } = useSnackbar();
	const navigate = useNavigate();
	const userId = useParams().userId;
	const dispatch = useDispatch();
	const serverURL = useContext(ServerContext);

	const { code, validCode, loading, resend, remainingTime } = useSelector(
		(store) => store.authVerificationCode
	);
	let timeoutId = null;
	const codeExpireTime = 60;

	useEffect(() => {
		const autoClearCodeRequest = async () => {
			try {
				await fetch(`${serverURL}/recover-password/auto-clear-code`, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ userId }),
				})
					.then((res) => res.json())
					.then((data) => {
						if (data.msg === "User not found") {
							console.log("User not found");
						} else if (data.msg === "Success") {
							console.log("Code has expired");
						}
					});
			} catch (error) {
				console.error("Error:", error);
			}
		};

		timeoutId = setTimeout(() => {
			autoClearCodeRequest();
		}, 5 * 60 * 1000); // 5 minutes in milliseconds

		// Clean up the timeout to prevent memory leaks
		return () => clearTimeout(timeoutId);
	}, [resend]);

	useEffect(() => {
		const countdown = () => {
			dispatch(setRemainingTime(remainingTime - 1));
		};

		const countdownInterval = setInterval(countdown, 1000);

		if (remainingTime == 0) {
			const resendLink = document.getElementById("resend-link");
			resendLink.style.cursor = "pointer";
			clearInterval(countdownInterval);
		}

		return () => clearInterval(countdownInterval);
	}, [remainingTime]);

	const handleChange = (value) => {
		const reg = /[0-9]/;
		if (!reg.test(value.charAt(value.length - 1)) && value.length !== 0) {
			return code;
		} else {
			dispatch(setCode(value));
		}
	};

	const handleReturn = async () => {
		try {
			await fetch(`${serverURL}/recover-password/remove-code`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					userId: userId,
				}),
			})
				.then((res) => res.json())
				.then((data) => {
					if (data.msg === "User not found") {
						console.log("User not found");
					} else if (data.msg === "Success") {
						console.log("Verification code is cleared");
					}
				});
		} catch (err) {
			console.log(err);
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		try {
			dispatch(setLoading(true));
			await fetch(`${serverURL}/recover-password/auth-verification-code`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					userId: userId,
					verificationCode: code,
				}),
			})
				.then((res) => res.json())
				.then((data) => {
					if (data.msg === "Invalid code") {
						dispatch(setValidCode(false));
						enqueueSnackbar("Invalid code", {
							variant: "error",
						});
					} else if (data.msg === "Valid code") {
						dispatch(setValidCode(true));
						dispatch(setCode(""));
						navigate(`/recover-password/reset-password/${userId}`);
					}
					dispatch(setLoading(false));
				});
		} catch (err) {
			enqueueSnackbar("Could not connect to the server", {
				variant: "error",
			});
			dispatch(setLoading(false));
		}
	};

	const handleResend = async () => {
		try {
			clearTimeout(timeoutId);
			dispatch(setLoading(true));
			dispatch(setRemainingTime(codeExpireTime));
			await fetch(`${serverURL}/recover-password/resend-code`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					userId: userId,
				}),
			})
				.then((res) => res.json())
				.then((data) => {
					if (data.msg === "User not found") {
						enqueueSnackbar("Some error occurred. Please go to previous page", {
							variant: "error",
						});
					} else if (data.msg === "Success") {
						enqueueSnackbar("Resent code", {
							variant: "success",
						});
					}
					dispatch(setLoading(false));
					dispatch(setResend(!resend));
				});
		} catch (err) {
			enqueueSnackbar("Could not connect to the server", {
				variant: "error",
			});
			dispatch(setLoading(false));
		}
	};

	return (
		<div className="main-container">
			{loading && <Spinner />}
			<form onSubmit={handleSubmit} className="form-container">
				<div className="relative">
					<div className="absolute top-1" onClick={handleReturn}>
						<BackArrow destination="/recover-password" />
					</div>
					<h2 className="text-center font-semibold">Verify Code</h2>
				</div>
				<HorizontalRule />
				<p>Please enter 6-digit verification code</p>
				<input
					type="text"
					onChange={(e) => handleChange(e.target.value)}
					value={code}
					minLength={6}
					maxLength={6}
					required
					className={`border w-full rounded-xl my-3 ${
						validCode ? "border-gray-500" : "border-red-500"
					}`}
					placeholder="Verification code"
				/>
				<div
					className="flex items-center justify-between mb-3"
					id="resend-link"
				>
					<p
						className={`m-0 w-3/5 text-sm ${
							remainingTime === 0 ? "text-blue-500" : "text-gray-500"
						} fw-semibold`}
						onClick={remainingTime === 0 ? handleResend : null}
					>
						Resend verification code{" "}
						{remainingTime === 0 ? "" : `in ${remainingTime}s`}
					</p>
					<button className="btn-blue text-base">NEXT</button>
				</div>
			</form>
		</div>
	);
};

export default AuthVerificationCode;

import { React, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";
import BackArrow from "../../components/BackArrow.jsx";
import Spinner from "../../components/Spinner.jsx";

const AuthVerificationCode = () => {
	const codeExpireTime = 60;
	const [code, setCode] = useState("");
	const [validCode, setValidCode] = useState(true);
	const userId = useParams().userId;
	const { enqueueSnackbar } = useSnackbar();
	const navigate = useNavigate();
	const [loading, setLoading] = useState(false);
	const [resend, setResend] = useState(false);
	const [remainingTime, setRemainingTime] = useState(codeExpireTime);
	let timeoutId = null;

	useEffect(() => {
		const autoClearCodeRequest = async () => {
			try {
				await fetch(
					"https://fyp-fsktm-connect.onrender.com/recover-password/auto-clear-code",
					{
						method: "POST",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify({ userId }),
					}
				)
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
			setRemainingTime((prevRemainingTime) => prevRemainingTime - 1);
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
			setCode(value);
		}
	};

	const handleReturn = async () => {
		try {
			await fetch(
				"https://fyp-fsktm-connect.onrender.com/recover-password/remove-code",
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						userId: userId,
					}),
				}
			)
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
			setLoading(true);
			await fetch(
				`https://fyp-fsktm-connect.onrender.com/recover-password/auth-verification-code`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						userId: userId,
						verificationCode: code,
					}),
				}
			)
				.then((res) => res.json())
				.then((data) => {
					if (data.msg === "Invalid code") {
						enqueueSnackbar("Invalid code", {
							variant: "error",
						});
						setValidCode(false);
					} else if (data.msg === "Valid code") {
						navigate(`/recover-password/reset-password/${userId}`);
						setValidCode(true);
					}
					setLoading(false);
				});
		} catch (err) {
			enqueueSnackbar("Could not connect to the server", {
				variant: "error",
			});
			setLoading(false);
		}
	};

	const handleResend = async () => {
		try {
			clearTimeout(timeoutId);
			setLoading(true);
			setRemainingTime(codeExpireTime);
			const resendLink = document.getElementById("resend-link");
			resendLink.style.cursor = "";
			await fetch(
				`https://fyp-fsktm-connect.onrender.com/recover-password/resend-code`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						userId: userId,
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
						enqueueSnackbar("Resent code", {
							variant: "success",
						});
					}
					setLoading(false);
					setResend((prevResend) => !prevResend);
				});
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
				onSubmit={handleSubmit}
				className="border border-secondary rounded-4 px-3 pt-3 position-relative"
				style={{ maxWidth: "340px" }}
			>
				<div className="d-flex justify-content-center position-relative align-items-center">
					<div className="position-absolute start-0" onClick={handleReturn}>
						<BackArrow destination="/recover-password" />
					</div>
					<h3 className="text-center m-0">Verify Code</h3>
				</div>
				<hr />
				<p>Please enter 6-digit verification code</p>
				<input
					type="text"
					onChange={(e) => handleChange(e.target.value)}
					value={code}
					minLength={6}
					maxLength={6}
					required
					className={`form-control ${
						validCode ? "border-secondary" : "border-danger"
					}`}
					placeholder="Verification code"
				/>
				<div
					className="d-flex align-items-center justify-content-between my-3"
					id="resend-link"
				>
					<p
						className={`m-0 ${
							remainingTime === 0 ? "text-primary" : "text-secondary"
						} fw-semibold`}
						style={{ fontSize: "13px", width: "60%" }}
						onClick={remainingTime === 0 ? handleResend : null}
					>
						Resend verification code{" "}
						{remainingTime === 0 ? "" : `in ${remainingTime}s`}
					</p>
					<button className="btn btn-primary">NEXT</button>
				</div>
			</form>
		</div>
	);
};

export default AuthVerificationCode;

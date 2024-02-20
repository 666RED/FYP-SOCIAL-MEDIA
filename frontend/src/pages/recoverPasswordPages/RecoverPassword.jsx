import { React, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import BackArrow from "../../components/BackArrow.jsx";
import { useSnackbar } from "notistack";
import Spinner from "../../components/Spinner.jsx";
import HorizontalRule from "../../components/HorizontalRule.jsx";
import {
	setEmail,
	setLoading,
	setValidEmail,
} from "./features/recoverPassword.js";
import { ServerContext } from "../../App.js";

const RecoverPassword = () => {
	const navigate = useNavigate();
	const { enqueueSnackbar } = useSnackbar();

	const serverURL = useContext(ServerContext);
	const dispatch = useDispatch();
	const { email, loading, validEmail } = useSelector(
		(store) => store.recoverPassword
	);

	const handleSubmit = async (e) => {
		e.preventDefault();
		dispatch(setLoading(true));
		try {
			await fetch(`${serverURL}/recover-password/auth-email`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					userEmailAddress: email.toLowerCase(),
				}),
			})
				.then((res) => res.json())
				.then((data) => {
					if (data.msg === "Not exist") {
						dispatch(setValidEmail(false));
						enqueueSnackbar("User does not exist", { variant: "error" });
					} else if (data.msg === "Error") {
						dispatch(setValidEmail(false));
						enqueueSnackbar("Some errors occurred", {
							variant: "error",
						});
					} else if (data.msg === "Success") {
						dispatch(setValidEmail(true));
						dispatch(setEmail(""));
						const userId = data.user._id;
						enqueueSnackbar("Please check your mailbox", {
							variant: "success",
						});
						navigate(`/recover-password/auth/${userId}`);
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

	return (
		<div className="main-container">
			{loading && <Spinner />}
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
						validEmail ? "border-gray-500" : "border-red-500"
					}`}
					placeholder="Student / Staff Email Address"
					value={email}
					onChange={(e) => dispatch(setEmail(e.target.value))}
				/>
				<button className="btn-blue mt-5 block w-full text-xl">SEND</button>
			</form>
		</div>
	);
};

export default RecoverPassword;

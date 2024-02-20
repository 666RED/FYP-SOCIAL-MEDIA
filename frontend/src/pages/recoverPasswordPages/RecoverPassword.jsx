import { React, useState } from "react";
import { useNavigate } from "react-router-dom";
import BackArrow from "../../components/BackArrow.jsx";
import { useSnackbar } from "notistack";
import Spinner from "../../components/Spinner.jsx";

const RecoverPassword = () => {
	const navigate = useNavigate();
	const { enqueueSnackbar } = useSnackbar();
	const [email, setEmail] = useState("");
	const [loading, setLoading] = useState(false);
	const [validEmail, setValidEmail] = useState(true);

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		try {
			await fetch(
				"https://fyp-fsktm-connect.onrender.com/recover-password/auth-email",
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						userEmailAddress: email.toLowerCase(),
					}),
				}
			)
				.then((res) => res.json())
				.then((data) => {
					if (data.msg === "Not exist") {
						enqueueSnackbar("User does not exist", { variant: "error" });
						setValidEmail(false);
					} else if (data.msg === "Error") {
						enqueueSnackbar("Some errors occurred", {
							variant: "error",
						});
						setValidEmail(false);
					} else if (data.msg === "Success") {
						const userId = data.user._id;
						enqueueSnackbar("Please check your mailbox", {
							variant: "success",
						});
						setValidEmail(true);
						navigate(`/recover-password/auth/${userId}`);
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

	return (
		<div className="position-fixed top-0 bottom-0 start-0 end-0 d-flex align-items-center justify-content-center">
			{loading && <Spinner />}
			<form
				className="border border-secondary rounded-4 p-3 position-relative"
				style={{ maxWidth: "340px" }}
				onSubmit={handleSubmit}
			>
				<div className="d-flex justify-content-center position-relative align-items-center">
					<div className="position-absolute start-0">
						<BackArrow destination="/" />
					</div>
					<h3 className="text-center m-0">Recover Password</h3>
				</div>
				<hr />
				<p>Enter your registered email to get 6-digit verification code</p>
				<input
					type="email"
					minLength={20}
					maxLength={50}
					required
					className={`form-control ${
						validEmail ? "border-secondary" : "border-danger"
					}`}
					placeholder="Student / Staff Email Address"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
				/>
				<button className="btn btn-primary py-2 px-4 mt-4 d-block w-100">
					Send
				</button>
			</form>
		</div>
	);
};

export default RecoverPassword;

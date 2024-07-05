import { React, useContext, useState, useReducer } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useSnackbar, closeSnackbar } from "notistack";
import { MdCancel } from "react-icons/md";
import { BsEyeFill, BsEyeSlashFill } from "react-icons/bs/index.js";
import RegisterForm from "./RegisterForm.jsx";
import Spinner from "../../components/Spinner/Spinner.jsx";
import HorizontalRule from "../../components/HorizontalRule.jsx";
import { INITIAL_STATE, loginReducer } from "./reducers/loginReducer.js";
import ACTION_TYPES from "./actionTypes/loginActionTypes.js";
import { setUser } from "../../features/authSlice.js";
import { ServerContext } from "../../App.js";

const Login = () => {
	localStorage.setItem("previous", JSON.stringify([])); // for back arrow purpose
	const serverURL = useContext(ServerContext);
	const [displayRegForm, setDisplayRegForm] = useState(false);
	const [loading, setLoading] = useState(false);
	const [state, dispatch] = useReducer(loginReducer, INITIAL_STATE);

	const authDispatch = useDispatch();
	const navigate = useNavigate();
	const { enqueueSnackbar } = useSnackbar();

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);

		try {
			const res = await fetch(`${serverURL}/auth/login`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					userEmailAddress: state.email,
					userPassword: state.password,
				}),
			});

			const data = await res.json();

			if (data.msg === "Not exist") {
				dispatch({ type: ACTION_TYPES.USER_NOT_EXIST });
				enqueueSnackbar("User does not exist", { variant: "error" });
			} else if (data.msg === "Invalid credentials") {
				dispatch({ type: ACTION_TYPES.INVALID_CREDENTIALS });
				enqueueSnackbar("Incorrect password", { variant: "error" });
			} else if (data.msg === "Success") {
				authDispatch(setUser({ token: data.token, user: data.user }));
				enqueueSnackbar("Login", { variant: "success" });
				navigate("/home/0");
			} else if (data.msg === "Early user") {
				authDispatch(setUser({ token: data.token, user: data.user }));
				enqueueSnackbar(
					"Congratulations! You are among the first 100 registered users. Enjoy your reward of a colorful frame.",
					{
						variant: "success",
						autoHideDuration: null,
						action: (key) => (
							<button onClick={() => closeSnackbar(key)}>
								<MdCancel className="text-xl" />
							</button>
						),
					}
				);
				navigate("/setting/1");
			} else if (data.msg === "Not activated yet") {
				enqueueSnackbar(
					"Please click the link in your email to activate your account",
					{
						autoHideDuration: null,
						variant: "default",
						action: (key) => (
							<button onClick={() => closeSnackbar(key)}>
								<MdCancel className="text-xl" />
							</button>
						),
					}
				);
			} else if (data.msg === "Fail to login") {
				enqueueSnackbar("Fail to login, please try again", {
					variant: "error",
				});
			} else {
				enqueueSnackbar("An error occurred", { variant: "error" });
			}

			setLoading(false);
		} catch (error) {
			enqueueSnackbar("Could not connect to the server", { variant: "error" });
			setLoading(false);
		}
	};

	return (
		<div>
			{loading && <Spinner />}
			{displayRegForm && <RegisterForm setDisplayRegForm={setDisplayRegForm} />}
			<div className="mt-5 w-1/2 mx-auto min-w-80 max-w-96 text-center">
				<img src="/logo.png" alt="Logo" className="w-full" />
				<form
					onSubmit={handleSubmit}
					className="p-3 border-gray-400 border rounded-lg mt-4"
				>
					<h1 className="text-center title mb-2">User Login</h1>
					<HorizontalRule />
					{/* EMAIL */}
					<input
						type="email"
						id="email"
						onChange={(e) =>
							dispatch({
								type: ACTION_TYPES.SET_EMAIL,
								payload: e.target.value,
							})
						}
						minLength={20}
						maxLength={50}
						value={state.email}
						className={`w-full border ${
							state.isUserExist ? "border-gray-500" : "border-red-500"
						} mt-5 p-3 rounded-md`}
						placeholder="Student / Staff Email Address"
						required
					/>
					{/* PASSWORD */}
					<div className="relative z-0">
						<input
							type={state.viewPassword ? "text" : "password"}
							id="password"
							minLength={8}
							maxLength={30}
							value={state.password}
							onChange={(e) =>
								dispatch({
									type: ACTION_TYPES.SET_PASSWORD,
									payload: e.target.value,
								})
							}
							className={`w-full form-control my-5 border ${
								state.isPasswordCorrect ? "border-gray-500" : "border-red-500"
							} p-3 rounded-md`}
							placeholder="Password"
							required
						/>
						{state.viewPassword ? (
							<BsEyeFill
								className="absolute text-xl top-9 right-2 cursor-pointer hover:text-blue-600"
								onClick={() =>
									dispatch({ type: ACTION_TYPES.TOGGLE_VIEW_PASSWORD })
								}
							/>
						) : (
							<BsEyeSlashFill
								className="absolute text-xl top-9 right-2 cursor-pointer hover:text-blue-600"
								onClick={() =>
									dispatch({ type: ACTION_TYPES.TOGGLE_VIEW_PASSWORD })
								}
							/>
						)}
					</div>
					{/* LOGIN BUTTON */}
					<button className="btn-blue block w-1/2 mx-auto mt-5">LOGIN</button>
					{/* FORGOT PASSWORD */}
					<p
						className="text-center inline-block mx-auto mt-5 text-blue-600 cursor-pointer text-sm hover:opacity-80"
						onClick={() => {
							navigate("/recover-password");
						}}
					>
						Forgot password?
					</p>
				</form>
				<h2 className="text-center my-4">OR</h2>
				{/* REGISTER NEW ACCOUNT BUTTON */}
				<button
					className="btn-green block mx-auto mb-3"
					onClick={() => setDisplayRegForm(true)}
				>
					Register New Account
				</button>
			</div>
			{/* FOOTER */}
			<footer className="bg-gray-700 py-1 fixed bottom-0 w-full">
				<p className="text-white text-center m-0 text-xs">
					Copyright &#169; 2024
				</p>
			</footer>
		</div>
	);
};

export default Login;

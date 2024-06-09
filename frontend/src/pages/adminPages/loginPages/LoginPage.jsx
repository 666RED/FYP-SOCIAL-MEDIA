import { React, useState, useContext } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import { BsEyeFill, BsEyeSlashFill } from "react-icons/bs";
import Spinner from "../../../components/Spinner/Spinner.jsx";
import HorizontalRule from "../../../components/HorizontalRule.jsx";
import { setAdmin } from "../../../features/adminSlice.js";
import { ServerContext } from "../../../App.js";

const LoginPage = () => {
	const serverURL = useContext(ServerContext);
	const [loading, setLoading] = useState(false);
	const [userId, setUserId] = useState("");
	const [password, setPassword] = useState("");
	const [viewPassword, setViewPassword] = useState(false);
	const navigate = useNavigate();
	const { enqueueSnackbar } = useSnackbar();
	const sliceDispatch = useDispatch();

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			setLoading(true);

			const res = await fetch(`${serverURL}/admin/login`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					userId: userId,
					password: password,
				}),
			});

			const { msg, token, user } = await res.json();

			if (msg === "Success") {
				sliceDispatch(setAdmin({ token, user }));
				enqueueSnackbar("Login", { variant: "success" });
				navigate("/admin/dashboard");
			} else if (msg === "Fail to login") {
				enqueueSnackbar("Incorrect credentials", {
					variant: "error",
				});
			} else {
				enqueueSnackbar("An error occurred", { variant: "error" });
			}

			setLoading(false);
		} catch (err) {
			enqueueSnackbar("Could not connect to the server", { variant: "error" });
			setLoading(false);
		}
	};

	return (
		<div>
			{loading && <Spinner />}
			<div className="mt-5 w-1/2 mx-auto min-w-80 max-w-96 text-center">
				<img src="/logo.png" alt="Logo" className="w-full" />
				<form
					onSubmit={handleSubmit}
					className="p-3 border-gray-400 border rounded-lg mt-4"
				>
					{/* TITLE */}
					<h1 className="text-center title mb-2">Admin Login</h1>
					<HorizontalRule />
					{/* USER ID */}
					<input
						type="text"
						id="user-id"
						onChange={(e) => setUserId(e.target.value)}
						minLength={1}
						maxLength={20}
						value={userId}
						className="w-full border border-gray-500 mt-5 p-3 rounded-md"
						placeholder="User ID"
						required
					/>
					{/* PASSWORD */}
					<div className="relative z-0">
						<input
							type={viewPassword ? "text" : "password"}
							id="password"
							minLength={8}
							maxLength={30}
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							className="w-full form-control my-5 border border-gray-500 p-3 rounded-md"
							placeholder="Password"
							required
						/>
						{viewPassword ? (
							<BsEyeFill
								className="absolute text-xl top-9 right-2 cursor-pointer hover:text-blue-600"
								onClick={() => setViewPassword((prev) => !prev)}
							/>
						) : (
							<BsEyeSlashFill
								className="absolute text-xl top-9 right-2 cursor-pointer hover:text-blue-600"
								onClick={() => setViewPassword((prev) => !prev)}
							/>
						)}
					</div>
					{/* LOGIN BUTTON */}
					<button className="btn-blue block w-1/2 mx-auto mt-5">LOGIN</button>
					{/* FORGOT PASSWORD */}
					<p
						className="text-center inline-block mx-auto mt-5 text-blue-600 cursor-pointer text-sm hover:opacity-80"
						onClick={() => {
							navigate("contact");
						}}
					>
						Forgot password?
					</p>
				</form>
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

export default LoginPage;

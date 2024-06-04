import { React, useContext, useReducer } from "react";
import { useDispatch } from "react-redux";
import { BsEyeFill, BsEyeSlashFill } from "react-icons/bs/index.js";
import { enqueueSnackbar } from "notistack";
import Spinner from "../../components/Spinner/Spinner.jsx";
import Filter from "../../components/Filter.jsx";
import FormHeader from "../../components/FormHeader.jsx";
import { registerReducer, INITIAL_STATE } from "./reducers/registerReducer.js";
import { ACTION_TYPES } from "./actionTypes/registerActionTypes.js";
import { ServerContext } from "../../App.js";
import { clearState } from "./reducers/loginSlice.js";

const RegisterForm = ({ setDisplayRegForm }) => {
	const serverURL = useContext(ServerContext);
	const [state, dispatch] = useReducer(registerReducer, INITIAL_STATE);
	const loginDispatch = useDispatch();

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (state.name.trim() === "") {
			enqueueSnackbar("Please enter your name", {
				variant: "warning",
			});
			return;
		} else if (state.name.trim().length < 3) {
			enqueueSnackbar("Name should not less than 3 characters", {
				variant: "warning",
			});
			return;
		}
		try {
			dispatch({ type: ACTION_TYPES.SET_LOADING, payload: true });
			const emailReg = /^(.+)@(student\.uthm\.edu\.my|uthm\.edu\.my)$/;
			const phoneReg = /^0[0-9]{8,}$/;

			if (!phoneReg.test(state.phoneNumber)) {
				dispatch({ type: ACTION_TYPES.INVALID_PHONE_NUMBER });
				enqueueSnackbar("Invalid phone number", {
					variant: "error",
				});
			} else if (!emailReg.test(state.email)) {
				dispatch({ type: ACTION_TYPES.INVALID_EMAIL });
				enqueueSnackbar("Only Student / Staff Email Address", {
					variant: "error",
				});
			} else {
				const res = await fetch(`${serverURL}/auth/register`, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						userName: state.name.trim(),
						userGender: state.gender,
						userEmailAddress: state.email.toLowerCase(),
						userPhoneNumber: state.phoneNumber,
						userPassword: state.password,
					}),
				});

				const data = await res.json();

				if (data.msg === "Email existed") {
					dispatch({ type: ACTION_TYPES.EMAIL_EXISTED });
					enqueueSnackbar("Email already existed", {
						variant: "error",
					});
				} else if (data.msg === "Phone number existed") {
					dispatch({ type: ACTION_TYPES.PHONE_NUMBER_EXISTED });
					enqueueSnackbar("Phone number already existed", {
						variant: "error",
					});
				} else if (data.msg === "Success") {
					enqueueSnackbar("Registered successfully", {
						variant: "success",
					});
					loginDispatch(clearState());
					dispatch({ type: ACTION_TYPES.SUGGESS_REGISTER });
					setDisplayRegForm(false);
				} else {
					enqueueSnackbar("An error occurred", {
						variant: "error",
					});
				}
			}

			dispatch({ type: ACTION_TYPES.SET_LOADING, payload: false });
		} catch (error) {
			enqueueSnackbar("Could not connect to the server", { variant: "error" });
			dispatch({ type: ACTION_TYPES.SET_LOADING, payload: false });
		}
	};

	return (
		<div>
			{state.loading && <Spinner />}
			<Filter />
			<div className="center-container">
				<form onSubmit={handleSubmit} className="form">
					<FormHeader
						title="Register"
						closeFunction={() => dispatch(setDisplayRegForm(false))}
					/>
					{/* inputs */}
					{/* NAME */}
					<label htmlFor="register-name">Name:</label>
					<input
						type="text"
						id="register-name"
						value={state.name}
						onChange={(e) =>
							dispatch({ type: ACTION_TYPES.SET_NAME, payload: e.target.value })
						}
						className={
							"inline border border-gray-500 w-full  rounded-lg mt-1 mb-3"
						}
						required
						minLength={3}
						maxLength={50}
					/>
					{/* GENDER */}
					<label>Gender:</label>
					<div className="flex mt-1 mb-3">
						{/* MALE */}
						<div>
							<input
								type="radio"
								id="genderRadioMale"
								name="gender"
								value="male"
								onChange={(e) =>
									dispatch({
										type: ACTION_TYPES.SET_GENDER,
										payload: e.target.value,
									})
								}
								required
							/>
							<label htmlFor="genderRadioMale" className="mr-3 ml-1">
								Male
							</label>
						</div>
						{/* FEMALE */}
						<div>
							<input
								type="radio"
								id="genderRadioFemale"
								name="gender"
								value="female"
								required
								onChange={(e) =>
									dispatch({
										type: ACTION_TYPES.SET_GENDER,
										payload: e.target.value,
									})
								}
							/>
							<label htmlFor="genderRadioFemale" className="ml-1">
								Female
							</label>
						</div>
					</div>
					{/* EMAIL */}
					<label htmlFor="register-email">Email Address:</label>
					<input
						type="email"
						id="register-email"
						className={`w-full  mt-1 mb-3 border rounded-lg ${
							state.validEmail ? "border-gray-500" : "border-red-500"
						}`}
						placeholder="Student / Stuff Email Address"
						value={state.email}
						minLength={20}
						maxLength={50}
						onChange={(e) =>
							dispatch({
								type: ACTION_TYPES.SET_EMAIL,
								payload: e.target.value,
							})
						}
						required
					/>
					{/* PHONE NUMBER */}
					<label htmlFor="register-phone-number">Phone Number:</label>
					<input
						type="text"
						id="register-phone-number"
						className={` mt-1 mb-3 border w-full rounded-lg ${
							state.validPhoneNumber ? "border-gray-500" : "border-red-500"
						}`}
						placeholder="e.g. 0137829473"
						value={state.phoneNumber}
						onChange={(e) => {
							dispatch({
								type: ACTION_TYPES.SET_PHONE_NUMBER,
								payload: e.target.value,
							});
						}}
						required
					/>
					{/* PASSWORD */}
					<label htmlFor="register-password">Password:</label>
					<div className="relative">
						<input
							minLength={8}
							maxLength={30}
							type={state.viewPassword}
							id="register-password"
							className="mt-1 w-full rounded-lg mb-3 border border-gray-500"
							placeholder="At least 8 characters"
							value={state.password}
							onChange={(e) =>
								dispatch({
									type: ACTION_TYPES.SET_PASSWORD,
									payload: e.target.value,
								})
							}
							required
						/>
						{state.viewPassword === "password" ? (
							<BsEyeFill
								className="absolute text-xl top-5 right-2 cursor-pointer hover:text-blue-600"
								onClick={() => dispatch({ type: ACTION_TYPES.TOGGLE_PASSWORD })}
							/>
						) : (
							<BsEyeSlashFill
								className="absolute text-xl top-5 right-2 cursor-pointer hover:text-blue-600"
								onClick={() => dispatch({ type: ACTION_TYPES.TOGGLE_PASSWORD })}
							/>
						)}
					</div>
					{/* SUBMIT BUTTON */}
					<button className="btn-green block w-50 mx-auto py-2 px-5 mt-4">
						SUBMIT
					</button>
				</form>
			</div>
		</div>
	);
};

export default RegisterForm;

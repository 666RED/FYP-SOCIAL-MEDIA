import { React, useContext } from "react";
import { BsEyeFill } from "react-icons/bs/index.js";
import { MdCancel } from "react-icons/md/index.js";
import { enqueueSnackbar } from "notistack";
import Spinner from "../../components/Spinner.jsx";
import Filter from "../../components/Filter.jsx";
import { useDispatch, useSelector } from "react-redux";
import {
	setName,
	setGender,
	setEmail,
	setPhoneNumber,
	setPassword,
	togglePassword,
	invalidPhoneNumber,
	invalidEmail,
	emailExisted,
	phoneNumberExisted,
	successRegister,
	setLoading,
	clearRegisterState,
} from "../../features/registerSlice.js";
import { clearState, setDisplayRegForm } from "../../features/loginSlice.js";
import { ServerContext } from "../../App.js";

const RegisterForm = () => {
	const {
		loading,
		name,
		gender,
		validEmail,
		email,
		validPhoneNumber,
		phoneNumber,
		viewPassword,
		password,
	} = useSelector((store) => store.register);

	const dispatch = useDispatch();
	const serverURL = useContext(ServerContext);

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			dispatch(setLoading(true));
			const emailReg = /^(.+)@(student\.uthm\.edu\.my|uthm\.edu\.my)$/;
			const phoneReg = /^0[0-9]{8,}$/;
			if (!phoneReg.test(phoneNumber)) {
				dispatch(invalidPhoneNumber());
				enqueueSnackbar("Invalid phone number", {
					variant: "error",
				});
			} else if (!emailReg.test(email)) {
				dispatch(invalidEmail());
				enqueueSnackbar("Only Student / Staff Email Address", {
					variant: "error",
				});
			} else {
				await fetch(`${serverURL}/auth/register`, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						userName: name,
						userGender: gender,
						userEmailAddress: email.toLowerCase(),
						userPhoneNumber: phoneNumber,
						userPassword: password,
					}),
				})
					.then((res) => res.json())
					.then((data) => {
						if (data.msg === "Email existed") {
							dispatch(emailExisted());
							enqueueSnackbar("Email already existed", {
								variant: "error",
							});
						} else if (data.msg === "Phone number existed") {
							dispatch(phoneNumberExisted());
							enqueueSnackbar("Phone number already existed", {
								variant: "error",
							});
						} else if (data.msg === "Success") {
							enqueueSnackbar("Registered successfully", {
								variant: "success",
							});
							dispatch(successRegister());
							dispatch(clearRegisterState());
							dispatch(clearState());
						}
					});
			}
			dispatch(setLoading(false));
		} catch (error) {
			console.log(error);

			enqueueSnackbar("Could not connect to the server", { variant: "error" });
			dispatch(setLoading(false));
		}
	};

	return (
		<div>
			{loading && <Spinner />}
			<Filter />
			<div className="z-20 fixed top-0 bottom-0 left-0 right-0 flex items-center justify-center">
				<form
					onSubmit={handleSubmit}
					className="bg-white  border rounded-xl max-w-80 relative p-3"
				>
					<h1 className="text-center">Register</h1>
					<MdCancel
						className="absolute text-3xl right-1 top-4 cursor-pointer text-red-600 hover:opacity-80"
						onClick={() => {
							dispatch(setDisplayRegForm());
							dispatch(clearRegisterState());
						}}
					/>
					<hr className="mt-2" />
					{/* inputs */}
					{/* NAME */}
					<label htmlFor="register-name">Name:</label>
					<input
						type="text"
						id="register-name"
						value={name}
						onChange={(e) => dispatch(setName(e.target.value))}
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
						<div>
							<input
								type="radio"
								id="genderRadioMale"
								name="gender"
								value="male"
								onChange={(e) => dispatch(setGender(e.target.value))}
								required
							/>
							<label htmlFor="genderRadioMale" className="mr-3 ml-1">
								Male
							</label>
						</div>
						<div>
							<input
								type="radio"
								id="genderRadioFemale"
								name="gender"
								value="female"
								required
								onChange={(e) => dispatch(setGender(e.target.value))}
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
							validEmail ? "border-gray-500" : "border-red-500"
						}`}
						placeholder="Student / Stuff Email Address"
						value={email}
						minLength={20}
						maxLength={50}
						onChange={(e) => dispatch(setEmail(e.target.value))}
						required
					/>
					{/* PHONE NUMBER */}
					<label htmlFor="register-phone-number">Phone Number:</label>
					<input
						type="text"
						id="register-phone-number"
						className={` mt-1 mb-3 border w-full rounded-lg ${
							validPhoneNumber ? "border-gray-500" : "border-red-500"
						}`}
						placeholder="e.g. 0137829473"
						value={phoneNumber}
						onChange={(e) => {
							dispatch(setPhoneNumber(e.target.value));
						}}
						required
					/>
					{/* PASSWORD */}
					<label htmlFor="register-password">Password:</label>
					<div className="relative">
						<input
							minLength={8}
							maxLength={30}
							type={viewPassword}
							id="register-password"
							className={" mt-1 w-full rounded-lg mb-3 border border-gray-500"}
							placeholder="At least 8 characters"
							value={password}
							onChange={(e) => dispatch(setPassword(e.target.value))}
							required
						/>
						<BsEyeFill
							className="absolute text-xl top-5 right-2 cursor-pointer hover:text-blue-600"
							onClick={() => dispatch(togglePassword())}
						/>
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

import { React, useEffect, useReducer, useContext } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useSnackbar } from "notistack";
import Spinner from "../../../../../components/Spinner/Spinner.jsx";
import Title from "../smallComponents/Title.jsx";
import {
	updatePersonalInfoReducer,
	INITIAL_STATE,
} from "../features/updatePersonalInfoReducer.js";
import ACTION_TYPES from "../actionTypes/updatePersonalInfoActionTypes.js";
import { setUser } from "../../../../../features/authSlice.js";
import { ServerContext } from "../../../../../App.js";
import { SettingContext } from "../../SettingMainPage.jsx";

const UpdatePersonalInfo = () => {
	const { user, token } = useSelector((store) => store.auth);
	const sliceDispatch = useDispatch();
	const { setOption, setDiscardChanges } = useContext(SettingContext);
	const serverURL = useContext(ServerContext);
	const { enqueueSnackbar } = useSnackbar();
	const [state, dispatch] = useReducer(
		updatePersonalInfoReducer,
		INITIAL_STATE
	);

	// first render
	useEffect(() => {
		dispatch({ type: ACTION_TYPES.SET_LOADING, payload: true });
		dispatch({ type: ACTION_TYPES.FIRST_RENDER, payload: user });
		dispatch({ type: ACTION_TYPES.SET_LOADING, payload: false });
	}, []);

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			dispatch({ type: ACTION_TYPES.SET_LOADING, payload: true });

			const res = await fetch(`${serverURL}/setting/update-personal-info`, {
				method: "PATCH",
				body: JSON.stringify({
					userId: user._id,
					userName: state.name.trim(),
					userGender: state.gender,
					userPhoneNumber: state.phoneNumber,
				}),
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			});

			if (!res.ok && res.status === 403) {
				dispatch({
					type: ACTION_TYPES.SET_LOADING,
					payload: false,
				});
				enqueueSnackbar("Access Denied", { variant: "error" });
				return;
			}

			const { msg, updatedUser } = await res.json();

			if (msg === "Success") {
				sliceDispatch(setUser({ user: updatedUser, token: token }));
				enqueueSnackbar("Personal information updated", { variant: "success" });
				setOption("");
			} else if (msg === "User not found" || msg === "Fail to update user") {
				enqueueSnackbar("Fail to update personal information", {
					variant: "error",
				});
			} else if (msg === "Phone number is registered by other user") {
				enqueueSnackbar("Phone number is regsitered by other user", {
					variant: "warning",
				});
				document.querySelector("#phone-number").focus();
			} else {
				enqueueSnackbar("An error occurred", { variant: "error" });
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
		<form onSubmit={handleSubmit}>
			{state.loading && <Spinner />}
			{/* TITLE */}
			<Title title="Update personal information" />
			{/* USERNAME */}
			<label htmlFor="register-name">Name:</label>
			<input
				type="text"
				id="register-name"
				value={state.name}
				onChange={(e) => {
					dispatch({ type: ACTION_TYPES.SET_NAME, payload: e.target.value });
					setDiscardChanges(true);
				}}
				className="border border-gray-500 w-full  rounded-lg mt-1 mb-3"
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
						onChange={(e) => {
							dispatch({
								type: ACTION_TYPES.SET_GENDER,
								payload: e.target.value,
							});
							setDiscardChanges(true);
						}}
						required
						checked={state.gender === "male"}
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
						checked={state.gender === "female"}
						onChange={(e) => {
							dispatch({
								type: ACTION_TYPES.SET_GENDER,
								payload: e.target.value,
							});
							setDiscardChanges(true);
						}}
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
				className="w-full  mt-1 mb-3 border rounded-lg border-gray-500 text-gray-500"
				placeholder="Student / Stuff Email Address"
				value={state.email}
				readOnly
				disabled
			/>
			{/* PHONE NUMBER */}
			<label htmlFor="register-phone-number">Phone Number:</label>
			<input
				type="text"
				id="phone-number"
				className="mt-1 mb-3 border w-full rounded-lg border-gray-500"
				placeholder="e.g. 0137829473"
				value={state.phoneNumber}
				minLength={9}
				maxLength={11}
				onChange={(e) => {
					const phoneNumberReg = /^\d+$/;
					if (phoneNumberReg.test(e.target.value) || e.target.value === "") {
						dispatch({
							type: ACTION_TYPES.SET_PHONE_NUMBER,
							payload: e.target.value,
						});
						setDiscardChanges(true);
					}
				}}
				required
			/>
			{/* UPDATE BUTTON */}
			<button className="btn-green block mx-auto mt-3 md:w-1/3 w-1/2">
				UPDATE
			</button>
		</form>
	);
};

export default UpdatePersonalInfo;

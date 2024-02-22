import { BrowserRouter, Routes, Route } from "react-router-dom";
import { createContext, useState } from "react";
import Login from "./pages/loginPages/Login.jsx";
import Homepage from "./pages/homepages/Homepage.jsx";
import RecoverPassword from "./pages/recoverPasswordPages/RecoverPassword.jsx";
import AuthVerificationCode from "./pages/recoverPasswordPages/AuthVerificationCode.jsx";
import ResetPassword from "./pages/recoverPasswordPages/ResetPassword.jsx";
import Profile from "./pages/profilePages/UserProfilePage.jsx";
import EditProfile from "./pages/profilePages/EditProfile.jsx";
import ViewFriends from "./pages/profilePages/ViewFriends.jsx";

export const ServerContext = createContext();

function App() {
	const server = "https://fyp-fsktm-connect.onrender.com";
	// const server = "http://localhost:3001";

	return (
		<ServerContext.Provider value={server}>
			<BrowserRouter>
				<Routes>
					<Route path="/" element={<Login />} />
					<Route path="/home" element={<Homepage />} />
					<Route path="/recover-password" element={<RecoverPassword />} />
					<Route
						path="/recover-password/auth/:userId"
						element={<AuthVerificationCode />}
					/>
					<Route
						path="/recover-password/reset-password/:userId"
						element={<ResetPassword />}
					/>
					<Route path="/profile" element={<Profile />} />
					<Route path="/profile/edit-profile" element={<EditProfile />} />
					<Route path="/profile/view-friends" element={<ViewFriends />} />
				</Routes>
			</BrowserRouter>
		</ServerContext.Provider>
	);
}

export default App;

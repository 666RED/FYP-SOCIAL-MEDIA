import { BrowserRouter, Routes, Route } from "react-router-dom";
import { createContext, useState } from "react";
import Login from "./pages/loginPages/Login.jsx";
import Homepage from "./pages/homepages/Homepage.jsx";
import RecoverPassword from "./pages/recoverPasswordPages/RecoverPassword.jsx";
import AuthVerificationCode from "./pages/recoverPasswordPages/AuthVerificationCode.jsx";
import ResetPassword from "./pages/recoverPasswordPages/ResetPassword.jsx";
import UserProfilePage from "./pages/profilePages/UserProfilePage.jsx";
import EditProfile from "./pages/profilePages/EditProfile.jsx";
import ViewFriends from "./pages/profilePages/ViewFriendsPage.jsx";
import CampusCondition from "./pages/campusConditionPages/pages/mainPage/CampusConditionPage.jsx";
import UploadCondition from "./pages/campusConditionPages/pages/uploadPage/UploadCondition.jsx";
import ViewMostUsefulCondition from "./pages/campusConditionPages/pages/viewMostUsefulConditionPage/ViewMostUsefulCondition.jsx";
import FriendPage from "./pages/friendPages/pages/mainPages/FriendPage.jsx";
import FriendRequestPage from "./pages/friendPages/pages/friendRequestPages/FriendRequestPage.jsx";
import ExploreFriendPage from "./pages/friendPages/pages/exploreFriendPages/ExploreFriendPage.jsx";
import PendingPage from "./pages/friendPages/pages/pendingPage/PendingPage.jsx";
import GroupPage from "./pages/groupPages/pages/mainPage/GroupPage.jsx";
import CreateNewGroupPage from "./pages/groupPages/pages/createNewGroupPage/CreateNewGroupPage.jsx";
import SingleGroupPage from "./pages/groupPages/pages/singleGroupPage/SingleGroupPage.jsx";
import EditGroupPage from "./pages/groupPages/pages/editGroupPage/EditGroupPage.jsx";
import JoinRequestPage from "./pages/groupPages/pages/joinRequestPage/JoinRequestPage.jsx";
import ViewMembersPage from "./pages/groupPages/pages/viewMembersPage/ViewMembersPage.jsx";
import MarketplaceMainPage from "./pages/marketplacePages/pages/mainPages/MainPage.jsx";
import CreateNewItem from "./pages/marketplacePages/pages/addNewPages/CreateNewItem.jsx";
import ViewProduct from "./pages/marketplacePages/pages/mainPages/components/product/ViewProduct.jsx";
import EditProduct from "./pages/marketplacePages/pages/mainPages/components/product/EditProduct.jsx";
import ViewService from "./pages/marketplacePages/pages/mainPages/components/service/ViewService.jsx";
import EditService from "./pages/marketplacePages/pages/mainPages/components/service/EditService.jsx";
import ViewEvent from "./pages/marketplacePages/pages/mainPages/components/event/ViewEvent.jsx";
import EditEvent from "./pages/marketplacePages/pages/mainPages/components/event/EditEvent.jsx";

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
					<Route path="/profile/:userId" element={<UserProfilePage />} />
					<Route path="/profile/edit-profile" element={<EditProfile />} />
					<Route
						path="/profile/view-friends/:userId"
						element={<ViewFriends />}
					/>
					<Route path="/campus-condition" element={<CampusCondition />} />
					<Route
						path="/campus-condition/upload-condition"
						element={<UploadCondition />}
					/>
					<Route
						path="/campus-condition/view-most-useful-condition/:conditionId"
						element={<ViewMostUsefulCondition />}
					/>
					<Route path="/friend" element={<FriendPage />} />
					<Route
						path="/friend/friend-request"
						element={<FriendRequestPage />}
					/>
					<Route
						path="/friend/explore-friend"
						element={<ExploreFriendPage />}
					/>
					<Route
						path="/friend/friend-request-pending"
						element={<PendingPage />}
					/>
					<Route path="/group" element={<GroupPage />} />
					<Route
						path="/group/create-new-group"
						element={<CreateNewGroupPage />}
					/>
					<Route path="/group/:groupId" element={<SingleGroupPage />} />
					<Route
						path="/group/edit-group/:groupId"
						element={<EditGroupPage />}
					/>
					<Route
						path="/group/join-request/:groupId"
						element={<JoinRequestPage />}
					/>
					<Route
						path="/group/view-members/:groupId/:groupAdminId"
						element={<ViewMembersPage />}
					/>
					<Route path="/marketplace" element={<MarketplaceMainPage />} />
					<Route
						path="/marketplace/create-new-item"
						element={<CreateNewItem />}
					/>
					<Route
						path="/marketplace/product/view-product/:id"
						element={<ViewProduct />}
					/>
					<Route
						path="/marketplace/product/edit-product/:id"
						element={<EditProduct />}
					/>
					<Route
						path="/marketplace/service/view-service/:id"
						element={<ViewService />}
					/>
					<Route
						path="/marketplace/service/edit-service/:id"
						element={<EditService />}
					/>
					<Route
						path="/marketplace/event/edit-event/:id"
						element={<EditEvent />}
					/>
					<Route
						path="/marketplace/event/view-event/:id"
						element={<ViewEvent />}
					/>
				</Routes>
			</BrowserRouter>
		</ServerContext.Provider>
	);
}

export default App;

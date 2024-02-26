import { configureStore, combineReducers } from "@reduxjs/toolkit";
import {
	// store the states locally (when user close the tab, the states are still there in the browser)
	persistReducer,
	FLUSH,
	REHYDRATE,
	PAUSE,
	PERSIST,
	PURGE,
	REGISTER,
} from "redux-persist";
import authReducer from "../features/authSlice.js";
import loginReducer from "../pages/loginPages/reducers/loginSlice.js";
// import homepageReducer from "../pages/homepages/features/homepageSlice.js";
import userProfilePageReducer from "../pages/profilePages/features/userProfilePageSlice.js";
import commentReducer from "../pages/profilePages/features/comment/commentSlice.js";
import userPostReducer from "../pages/profilePages/features/userPosts/userPostSlice.js";

import storage from "redux-persist/lib/storage";

const persistConfig = { key: "auth", storage, version: 1 };

const persistedAuthReducer = persistReducer(persistConfig, authReducer);

const rootReducer = combineReducers({
	auth: persistedAuthReducer,
	login: loginReducer,
	// homepage: homepageReducer,
	userProfilePage: userProfilePageReducer,
	comment: commentReducer,
	post: userPostReducer,
});

export const store = configureStore({
	reducer: rootReducer,
	middleware: (getDefaultMiddleware) => {
		return getDefaultMiddleware({
			serializableCheck: {
				ignoreActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
			},
		});
	},
});

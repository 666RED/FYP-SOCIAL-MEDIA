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

import storage from "redux-persist/lib/storage";

const persistConfig = { key: "auth", storage, version: 1 };

const persistedAuthReducer = persistReducer(persistConfig, authReducer);

const rootReducer = combineReducers({
	auth: persistedAuthReducer,
	login: loginReducer,
	// homepage: homepageReducer,
	userProfilePage: userProfilePageReducer,
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

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
import registerReducer from "../pages/loginPages/features/registerSlice.js";
import loginReducer from "../pages/loginPages/features/loginSlice.js";
import authReducer from "../features/authSlice.js";
import recoverPasswordReducer from "../pages/recoverPasswordPages/features/recoverPassword.js";
import authVerificationCodeReducer from "../pages/recoverPasswordPages/features/authVerificationCode.js";
import resetPasswordReducer from "../pages/recoverPasswordPages/features/resetPassword.js";
import homepageReducer from "../pages/homepages/features/homepage.js";

import storage from "redux-persist/lib/storage";

const persistConfig = { key: "auth", storage, version: 1 };

const persistedAuthReducer = persistReducer(persistConfig, authReducer);

const rootReducer = combineReducers({
	auth: persistedAuthReducer,
	register: registerReducer,
	login: loginReducer,
	recoverPassword: recoverPasswordReducer,
	authVerificationCode: authVerificationCodeReducer,
	resetPassword: resetPasswordReducer,
	homepage: homepageReducer,
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

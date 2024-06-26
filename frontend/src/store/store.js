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
import searchReducer from "../features/searchSlice.js";
import commentReducer from "../components/comment/feature/commentSlice.js";
import userPostReducer from "../features/postSlice.js";
import campusConditionReducer from "../pages/campusConditionPages/features/campusConditionSlice.js";
import friendReducer from "../features/friendSlice.js";
import groupReducer from "../features/groupSlice.js";
import groupMemberReducer from "../features/groupMemberSlice.js";
import groupPostReducer from "../features/groupPostSlice.js";
import productReducer from "../features/productSlice.js";
import serviceReducer from "../features/serviceSlice.js";
import eventReducer from "../features/eventSlice.js";
import adminReducer from "../features/adminSlice.js";
import homeReducer from "../features/homeSlice.js";

import storage from "redux-persist/lib/storage";

const persistConfig = { key: "auth", storage, version: 1 };

const persistedAuthReducer = persistReducer(persistConfig, authReducer);

const persistedAdminReducer = persistReducer(persistConfig, adminReducer);

const rootReducer = combineReducers({
	auth: persistedAuthReducer,
	admin: persistedAdminReducer,
	comment: commentReducer,
	post: userPostReducer,
	campusCondition: campusConditionReducer,
	friend: friendReducer,
	search: searchReducer,
	group: groupReducer,
	groupMember: groupMemberReducer,
	groupPost: groupPostReducer,
	product: productReducer,
	service: serviceReducer,
	event: eventReducer,
	home: homeReducer,
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

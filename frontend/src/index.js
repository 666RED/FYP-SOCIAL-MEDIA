import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.js";
import "./index.css";
import { Provider } from "react-redux";
import { store } from "./store/store.js";
import { persistStore } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";
import { SnackbarProvider } from "notistack";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
	<Provider store={store}>
		<PersistGate loading={null} persistor={persistStore(store)}>
			<SnackbarProvider autoHideDuration={3000} maxSnack={2}>
				<App />
			</SnackbarProvider>
		</PersistGate>
	</Provider>
);

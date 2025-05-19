import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { TranslationProvider } from "./context/TranslationContext";
import router from "./router";
import "./App.css";
import "./styles/zIndex.css";
import { SettingsProvider } from "./context/SettingsContext";
import { UserProvider } from "./context/UserContext";
import { FriendProvider } from "./context/FriendContext";
import { ToastProvider } from "./context/ToastContext";

ReactDOM.createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<TranslationProvider>
			<UserProvider>
				<FriendProvider>
					<SettingsProvider>
						<ToastProvider>
							<RouterProvider router={router} />
						</ToastProvider>
					</SettingsProvider>
				</FriendProvider>
			</UserProvider>
		</TranslationProvider>
	</StrictMode>,
);

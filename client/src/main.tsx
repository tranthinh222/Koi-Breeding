import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { SoundProvider } from "./sound/SoundProvider";
import { ThemeProvider } from "./theme/ThemeProvider";
import { AuthProvider } from "./context/AuthContext";
import "./theme/theme.css";

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<AuthProvider>
			<ThemeProvider>
				<SoundProvider>
					<App />
				</SoundProvider>
			</ThemeProvider>
		</AuthProvider>
	</StrictMode>,
);

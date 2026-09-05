import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { SoundProvider } from "./sound/SoundProvider";
import { ThemeProvider } from "./theme/ThemeProvider";
import "./theme/theme.css";

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<ThemeProvider>
			<SoundProvider>
				<App />
			</SoundProvider>
		</ThemeProvider>
	</StrictMode>,
);

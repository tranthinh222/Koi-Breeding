import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
// import Profile from './profile/Profile.tsx'
import Home from "./pages/home/HomePage.tsx";

// const CurrentPage = window.location.pathname === '/' ? Home : Profile

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
// Đổi Profile thành những route khác

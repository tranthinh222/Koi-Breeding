
// const CurrentPage = window.location.pathname === '/' ? Home : Profile
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { AuthProvider } from './context/AuthContext.tsx'
import { SoundProvider } from './sound/SoundProvider'
import { ThemeProvider } from './theme/ThemeProvider'
import './theme/theme.css'

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

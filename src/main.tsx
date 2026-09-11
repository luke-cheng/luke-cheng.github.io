import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import PortfolioPage from './PortfolioPage.tsx'

const isPortfolioPage = new URLSearchParams(window.location.search).get("page") === "portfolio";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {isPortfolioPage ? <PortfolioPage /> : <App />}
  </StrictMode>,
)

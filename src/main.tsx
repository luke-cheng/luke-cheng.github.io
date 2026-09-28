import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import PortfolioPage from './PortfolioPage.tsx'
import BlogPage from './BlogPage.tsx'

const page = new URLSearchParams(window.location.search).get("page");

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {page === "portfolio" ? <PortfolioPage /> : page === "blog" ? <BlogPage /> : <App />}
  </StrictMode>,
)

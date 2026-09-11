import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

declare global {
  interface Window {
    __appBooted?: boolean
    __bootFallbackTimer?: number
  }
}

window.__appBooted = true
if (window.__bootFallbackTimer !== undefined) {
  window.clearTimeout(window.__bootFallbackTimer)
}
document.getElementById('boot-fallback')?.setAttribute('hidden', 'hidden')
document.getElementById('root')?.removeAttribute('hidden')

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

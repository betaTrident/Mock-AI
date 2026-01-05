import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { NextUIProvider } from "@nextui-org/react"
import { ToastProvider } from "./components/ui/Toast"

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <NextUIProvider>
      <ToastProvider>
        <App />
      </ToastProvider>
    </NextUIProvider>
  </StrictMode>,
)

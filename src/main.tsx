import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

// Suppress Ant Design React 19 compatibility warning
const originalConsoleWarn = console.warn;
console.warn = (...args) => {
  if (args[0]?.includes('antd v5 support React is 16 ~ 18')) {
    return; // Suppress this specific warning
  }
  originalConsoleWarn(...args);
};
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

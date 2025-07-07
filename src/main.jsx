import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
// PERBAIKAN: Ubah import dari "./App.js" menjadi "./App.jsx"
import App from './App.jsx';
import './index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
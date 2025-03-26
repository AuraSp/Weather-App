import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css'
import './assets/styles/global.scss';
import './assets/styles/utils/_media.scss';
import App from './App.tsx';
import './assets/styles/App.scss'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

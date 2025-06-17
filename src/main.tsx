import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import emailjs from '@emailjs/browser';
import App from './App.tsx';
import './index.css';
import { registerImageOptimizationServiceWorker, preloadPopularJerseyImages } from './utils/imageOptimization';
import { jerseys } from './data/jerseys';

// Initialize EmailJS with your user ID
emailjs.init('your_user_id');

// Registrar el Service Worker para optimización de imágenes
registerImageOptimizationServiceWorker();

// Precargar imágenes de camisetas populares para mejorar el rendimiento
preloadPopularJerseyImages(jerseys);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);

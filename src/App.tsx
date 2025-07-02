import React, { useEffect, Suspense, lazy } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { initGA, trackPageView } from './utils/analytics';

// Componentes cargados de forma inmediata
import Cart from './components/Cart';
import CustomCookieConsent from './components/CookieConsent';
import LoadingSpinner from './components/LoadingSpinner';

// Lazy loading de páginas
const Home = lazy(() => import('./pages/Home'));
const Catalog = lazy(() => import('./pages/Catalog'));
const PacksPage = lazy(() => import('./pages/PacksPage'));
const Kids = lazy(() => import('./pages/Kids'));
const LeaguePage = lazy(() => import('./pages/LeaguePage'));
const CheckoutPage = lazy(() => import('./pages/CheckoutPage'));
const JerseyDetail = lazy(() => import('./pages/JerseyDetail'));
const Favorites = lazy(() => import('./pages/Favorites'));

function App() {
  const location = useLocation();

  // Inicializar Google Analytics
  useEffect(() => {
    initGA();
  }, []);

  // Seguimiento de página
  useEffect(() => {
    trackPageView(location.pathname);
  }, [location]);

  // 👉 Scroll al top al cambiar de ruta
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/catalog" element={<Catalog />} />
          <Route path="/packs" element={<PacksPage />} />
          <Route path="/kids" element={<Kids />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/league/:leagueId" element={<LeaguePage />} />
          <Route path="/jersey/:jerseyId" element={<JerseyDetail />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/*" element={<Home />} />
        </Routes>
      </Suspense>

      <Cart />
      <Toaster />
      <CustomCookieConsent />
    </div>
  );
}

export default App;

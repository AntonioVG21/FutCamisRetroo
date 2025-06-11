import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Home from './pages/Home';
import Catalog from './pages/Catalog';
import PacksPage from './pages/PacksPage';
import Kids from './pages/Kids';
import LeaguePage from './pages/LeaguePage';
import CheckoutPage from './pages/CheckoutPage';
import JerseyDetail from './pages/JerseyDetail';
import Favorites from './pages/Favorites';
import Admin from './pages/Admin';
import SecretAdmin from './pages/SecretAdmin';
import AdminPacks from './pages/AdminPacks';
import Cart from './components/Cart';
import CustomCookieConsent from './components/CookieConsent';

function App() {
  const location = useLocation();

  // 👉 Inserta el script solo una vez
  useEffect(() => {
    const script = document.createElement('script');
    script.setAttribute('async', '');
    script.src = 'https://www.googletagmanager.com/gtag/js?id=G-DQZDW6TNY6';
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    function gtag() {
      window.dataLayer.push(arguments);
    }
    gtag('js', new Date());
    gtag('config', 'G-DQZDW6TNY6');
  }, []);

  // 👉 Seguimiento de ruta cada vez que cambia la página
  useEffect(() => {
    if (window.gtag) {
      window.gtag('config', 'G-DQZDW6TNY6', {
        page_path: location.pathname,
      });
    }
  }, [location]);

  // 👉 Scroll al top al cambiar de ruta
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/catalog" element={<Catalog />} />
        <Route path="/packs" element={<PacksPage />} />
        <Route path="/kids" element={<Kids />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/league/:leagueId" element={<LeaguePage />} />
        <Route path="/jersey/:jerseyId" element={<JerseyDetail />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/admin-secret" element={<SecretAdmin />} />
        <Route path="/admin-packs" element={<AdminPacks />} />
      </Routes>

      <Cart />
      <Toaster />
      <CustomCookieConsent />
    </div>
  );
}

export default App;

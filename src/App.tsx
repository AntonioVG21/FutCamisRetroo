import React from 'react';
import { Routes, Route } from 'react-router-dom';
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

function App() {

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
        <Route path="/admin-packs" element={<AdminPacks />} />
        <Route path="/secret-admin" element={<SecretAdmin />} />
      </Routes>
      <Toaster position="top-center" />
      {window.location.pathname !== '/checkout' && <Cart />}
    </div>
  );
}

export default App;
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { BasketPage } from './pages/Basket';

const root = ReactDOM.createRoot(document.getElementById('app')!);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/basket" element={<BasketPage />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

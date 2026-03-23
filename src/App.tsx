/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from './CartContext';
import Layout from './Layout';
import Home from './Home';
import PLP from './PLP';
import PDP from './PDP';
import Checkout from './Checkout';
import AddtoCart from './AddtoCart';
import MobileSearch from './MobileSearch';

export default function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <MobileSearch />
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="products" element={<PLP />} />
            <Route path="product/:id" element={<PDP />} />
            <Route path="addtocart" element={<AddtoCart />} />
            <Route path="checkout" element={<Checkout />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </CartProvider>
  );
}

import React from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import SiteLayout from './layouts/SiteLayout.jsx'
import AdminPage from './pages/AdminWorkspace.jsx'
import CartPage from './pages/CartPage.jsx'
import CheckoutPage from './pages/CheckoutPage.jsx'
import ConfirmationPage from './pages/ConfirmationPage.jsx'
import HomePage from './pages/HomePage.jsx'
import MenuPage from './pages/MenuPage.jsx'
import FoodDetailPage from './pages/FoodDetailPage.jsx'
import OrdersPage from './pages/OrdersPage.jsx'

export default function App() {
  return <><ScrollToTop /><Routes><Route element={<SiteLayout />}><Route index element={<HomePage />} /><Route path="menu" element={<MenuPage />} /><Route path="menu/:foodId" element={<FoodDetailPage />} /><Route path="cart" element={<CartPage />} /><Route path="checkout" element={<CheckoutPage />} /><Route path="confirmation/:orderNumber" element={<ConfirmationPage />} /><Route path="orders" element={<OrdersPage />} /></Route><Route path="/admin" element={<AdminPage />} /><Route path="*" element={<Navigate to="/" replace />} /></Routes></>
}

function ScrollToTop() {
  const location = useLocation()
  useEffect(() => {
    if (location.hash) document.getElementById(location.hash.slice(1))?.scrollIntoView()
    else window.scrollTo(0, 0)
  }, [location.pathname, location.hash])
  return null
}

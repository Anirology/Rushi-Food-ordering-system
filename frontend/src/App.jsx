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
import CustomerDashboard from './pages/CustomerDashboard.jsx'
import { ForgotPasswordPage, LoginPage, RegisterPage, ResetPasswordPage, VerifyEmailPage } from './pages/AuthPages.jsx'
import { useAuth } from './context/AuthContext.jsx'

export default function App() {
  return <><ScrollToTop /><Routes><Route index element={<LoginPage />} /><Route path="login" element={<LoginPage />} /><Route path="register" element={<RegisterPage />} /><Route path="verify-email" element={<VerifyEmailPage />} /><Route path="forgot-password" element={<ForgotPasswordPage />} /><Route path="reset-password" element={<ResetPasswordPage />} /><Route element={<SiteLayout />}><Route path="home" element={<HomePage />} /><Route path="menu" element={<MenuPage />} /><Route path="menu/:foodId" element={<FoodDetailPage />} /><Route path="cart" element={<CartPage />} /><Route path="checkout" element={<Protected element={<CheckoutPage />} />} /><Route path="confirmation/:orderNumber" element={<Protected element={<ConfirmationPage />} />} /><Route path="dashboard" element={<Protected element={<CustomerDashboard />} />} /><Route path="orders" element={<Protected element={<CustomerDashboard />} />} /></Route><Route path="/admin" element={<AdminPage />} /><Route path="*" element={<Navigate to="/" replace />} /></Routes></>
}

function Protected({ element }) { const { session, loading } = useAuth(); if (loading) return <div className="page-shell inner-page auth-loading">Opening your account…</div>; return session?.role === 'customer' ? element : <Navigate to={session?.role === 'admin' ? '/admin' : '/login'} replace /> }

function ScrollToTop() {
  const location = useLocation()
  useEffect(() => {
    if (location.hash) document.getElementById(location.hash.slice(1))?.scrollIntoView()
    else window.scrollTo(0, 0)
  }, [location.pathname, location.hash])
  return null
}

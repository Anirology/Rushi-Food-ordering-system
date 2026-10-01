import { Navigate, Route, Routes } from 'react-router-dom'
import SiteLayout from './layouts/SiteLayout.jsx'
import AdminPage from './pages/AdminPage.jsx'
import CartPage from './pages/CartPage.jsx'
import CheckoutPage from './pages/CheckoutPage.jsx'
import ConfirmationPage from './pages/ConfirmationPage.jsx'
import HomePage from './pages/HomePage.jsx'
import MenuPage from './pages/MenuPage.jsx'
import OrdersPage from './pages/OrdersPage.jsx'

export default function App() {
  return <Routes><Route element={<SiteLayout />}><Route index element={<HomePage />} /><Route path="menu" element={<MenuPage />} /><Route path="menu/:foodId" element={<MenuPage />} /><Route path="cart" element={<CartPage />} /><Route path="checkout" element={<CheckoutPage />} /><Route path="confirmation/:orderNumber" element={<ConfirmationPage />} /><Route path="orders" element={<OrdersPage />} /></Route><Route path="/admin" element={<AdminPage />} /><Route path="*" element={<Navigate to="/" replace />} /></Routes>
}

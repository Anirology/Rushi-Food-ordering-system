import React from 'react'
import { useState } from 'react'
import { ArrowLeft, ArrowRight, Check } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { foodImage } from '../data/menu.js'
import { submitOrder } from '../services/api.js'

const money = (amount) => `Rs. ${Number(amount).toLocaleString('en-LK')}`

export default function CheckoutPage() {
  const { items, subtotal, clear } = useCart()
  const { session } = useAuth()
  const navigate = useNavigate()
  const form = session?.customer || {}
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function placeOrder(event) {
    event.preventDefault()
    setBusy(true); setError('')
    try {
      if (String(form.phone || '').trim().length < 5 || String(form.address || '').trim().length < 5) {
        setError('Add a phone number and delivery address to your profile before placing an order.')
        return
      }
      const order = await submitOrder({ items: items.map((item) => ({ food_id: item.id, quantity: item.quantity })) })
      try { sessionStorage.setItem('rushi-last-order', JSON.stringify(order)) } catch { /* Confirmation can still show its order number if storage is unavailable. */ }
      clear()
      navigate(`/confirmation/${order.order_number}`)
    } catch (requestError) {
      setError(requestError.response?.status === 409
        ? 'One or more dishes are no longer available. Return to your cart and update your order.'
        : requestError.response?.status === 422 ? (requestError.response?.data?.detail || 'Complete your profile before placing an order.')
        : 'We couldn’t reach the kitchen just now. Your cart is safe; please try again in a moment.')
    } finally { setBusy(false) }
  }

  if (!items.length) return <div className="page-shell inner-page empty-state"><h2>Nothing to check out yet.</h2><Link className="button" to="/menu">See today’s menu <ArrowRight size={16} /></Link></div>

  const profileComplete = String(form.phone || '').trim().length >= 5 && String(form.address || '').trim().length >= 5
  return (
    <div className="page-shell inner-page checkout-page"><div className="inner-heading"><span className="eyebrow"><i /> Just a few details</span><h1>Let’s bring this<br /><em>to your table.</em></h1><p>Your order will use the delivery details saved to your account.</p></div><form className="checkout-layout" onSubmit={placeOrder}><div className="checkout-form-panel"><div className="step-heading"><span className="step-number">01</span><div><span className="eyebrow">Where should we find you?</span><h2>Your details</h2></div></div><div className="checkout-account-details"><b>{form.name}</b><span>{form.email}</span><span>{form.phone || 'Phone number not added'}</span><span>{form.address || 'Delivery address not added'}</span><Link className="text-link" to="/dashboard">Update your profile <ArrowRight size={14} /></Link></div>{!profileComplete && <p className="form-error">Add a phone number and delivery address to your profile before placing an order.</p>}<div className="checkout-reassurance"><span><Check size={15} /> Made fresh after you order</span><span><Check size={15} /> We’ll confirm delivery by phone</span></div>{error && <p className="form-error" role="alert">{error}</p>}<Link className="text-link checkout-back" to="/cart"><ArrowLeft size={15} /> Back to your order</Link></div><aside className="order-summary checkout-summary"><span className="eyebrow">02 — From the kitchen</span><h2>On the table</h2><div className="checkout-items">{items.map((item) => <div className="checkout-item" key={item.id}><img src={foodImage(item)} alt="" /><div><b>{item.name}</b><span>Quantity {item.quantity}</span></div><strong>{money(item.price * item.quantity)}</strong></div>)}</div><div className="summary-total"><span>Order total</span><strong>{money(subtotal)}</strong></div><p className="summary-note">Our team will get in touch to confirm your delivery and payment details. Payment is arranged directly with the kitchen.</p><button className="button button-full" type="submit" disabled={busy || !profileComplete}>{busy ? 'Sending to the kitchen…' : 'Place your order'} <ArrowRight size={16} /></button><span className="secure-note">A little care in every order <span>✳</span></span></aside></form></div>
  )
}

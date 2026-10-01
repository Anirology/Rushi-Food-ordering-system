import React from 'react'
import { ArrowLeft, ArrowRight, Check, MapPin, Phone, UserRound } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext.jsx'
import { foodImage } from '../data/menu.js'
import { submitOrder } from '../services/api.js'

const money = (amount) => `Rs. ${Number(amount).toLocaleString('en-LK')}`

export default function CheckoutPage() {
  const { items, subtotal, clear } = useCart()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', phone: '', address: '' })
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const change = (event) => setForm({ ...form, [event.target.name]: event.target.value })

  async function placeOrder(event) {
    event.preventDefault()
    setBusy(true); setError('')
    try {
      const order = await submitOrder({ customer: form, items: items.map((item) => ({ food_id: item.id, quantity: item.quantity })) })
      try { sessionStorage.setItem('rushi-last-order', JSON.stringify(order)) } catch { /* Confirmation can still show its order number if storage is unavailable. */ }
      clear()
      navigate(`/confirmation/${order.order_number}`)
    } catch (requestError) {
      setError(requestError.response?.status === 409
        ? 'One or more dishes are no longer available. Return to your cart and update your order.'
        : 'We couldn’t reach the kitchen just now. Your cart is safe; please try again in a moment.')
    } finally { setBusy(false) }
  }

  if (!items.length) return <div className="page-shell inner-page empty-state"><h2>Nothing to check out yet.</h2><Link className="button" to="/menu">See today’s menu <ArrowRight size={16} /></Link></div>

  return (
    <div className="page-shell inner-page checkout-page"><div className="inner-heading"><span className="eyebrow"><i /> Just a few details</span><h1>Let’s bring this<br /><em>to your table.</em></h1><p>Your details are used to arrange your order and delivery by phone.</p></div><form className="checkout-layout" onSubmit={placeOrder}><div className="checkout-form-panel"><div className="step-heading"><span className="step-number">01</span><div><span className="eyebrow">Where should we find you?</span><h2>Your details</h2></div></div><label className="form-field"><span>Your name</span><div><UserRound size={16} /><input name="name" autoComplete="name" value={form.name} onChange={change} minLength="2" required placeholder="The name on your door" /></div></label><div className="form-two-columns"><label className="form-field"><span>Email address</span><input name="email" type="email" autoComplete="email" value={form.email} onChange={change} required placeholder="you@example.com" /></label><label className="form-field"><span>Phone number</span><div><Phone size={16} /><input name="phone" type="tel" autoComplete="tel" minLength="5" value={form.phone} onChange={change} required placeholder="+94 77 123 4567" /></div></label></div><label className="form-field"><span>Delivery address</span><div className="textarea-wrap"><MapPin size={16} /><textarea name="address" autoComplete="street-address" value={form.address} onChange={change} required minLength="5" rows="3" placeholder="Street, neighbourhood, Jaffna" /></div></label><div className="checkout-reassurance"><span><Check size={15} /> Made fresh after you order</span><span><Check size={15} /> We’ll confirm delivery by phone</span></div>{error && <p className="form-error" role="alert">{error}</p>}<Link className="text-link checkout-back" to="/cart"><ArrowLeft size={15} /> Back to your order</Link></div><aside className="order-summary checkout-summary"><span className="eyebrow">02 — From the kitchen</span><h2>On the table</h2><div className="checkout-items">{items.map((item) => <div className="checkout-item" key={item.id}><img src={foodImage(item)} alt="" /><div><b>{item.name}</b><span>Quantity {item.quantity}</span></div><strong>{money(item.price * item.quantity)}</strong></div>)}</div><div className="summary-total"><span>Order total</span><strong>{money(subtotal)}</strong></div><p className="summary-note">Our team will get in touch to confirm your delivery and payment details. Payment is arranged directly with the kitchen.</p><button className="button button-full" type="submit" disabled={busy}>{busy ? 'Sending to the kitchen…' : 'Place your order'} <ArrowRight size={16} /></button><span className="secure-note">A little care in every order <span>✳</span></span></aside></form></div>
  )
}

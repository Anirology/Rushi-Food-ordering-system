import React from 'react'
import { ArrowLeft, ArrowRight, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext.jsx'
import { foodImage } from '../data/menu.js'

const money = (amount) => `Rs. ${Number(amount).toLocaleString('en-LK')}`

export default function CartPage() {
  const { items, subtotal, setQuantity, remove } = useCart()
  return (
    <div className="page-shell inner-page cart-page">
      <div className="inner-heading"><span className="eyebrow"><i /> Your order so far</span><h1>A little room<br />for <em>something good.</em></h1></div>
      {!items.length ? <div className="empty-state cart-empty"><span className="empty-icon"><ShoppingBag /></span><h2>Your table is waiting.</h2><p>Have a look at what’s fresh in the kitchen today.</p><Link className="button" to="/menu">Explore the menu <ArrowRight size={16} /></Link></div> : <div className="cart-layout"><div className="cart-items"><div className="cart-table-head"><span>The dishes</span><span>Quantity</span><span>Amount</span></div>{items.map((item) => <article className="cart-row" key={item.id}><img src={foodImage(item)} alt={item.name} /><div className="cart-item-info"><span className="food-category">{item.category || 'From our kitchen'}</span><h3>{item.name}</h3><p>{money(item.price)} each</p></div><div className="quantity-control"><button onClick={() => setQuantity(item.id, item.quantity - 1)} aria-label={`Remove one ${item.name}`}><Minus size={14} /></button><span>{item.quantity}</span><button onClick={() => setQuantity(item.id, item.quantity + 1)} aria-label={`Add one ${item.name}`}><Plus size={14} /></button></div><strong className="cart-line-price">{money(item.price * item.quantity)}</strong><button className="remove-button" onClick={() => remove(item.id)} aria-label={`Remove ${item.name}`}><Trash2 size={16} /></button></article>)}<Link className="text-link back-menu" to="/menu"><ArrowLeft size={15} /> Keep looking around</Link></div><aside className="order-summary"><span className="eyebrow">A little summary</span><h2>Your order</h2><div className="summary-line"><span>Items ({items.reduce((sum, item) => sum + item.quantity, 0)})</span><span>{money(subtotal)}</span></div><div className="summary-line"><span>Delivery</span><span className="muted">At checkout</span></div><div className="summary-total"><span>Subtotal</span><strong>{money(subtotal)}</strong></div><p className="summary-note">Delivery details and any fees will be confirmed with you before your order is placed.</p><Link className="button button-full" to="/checkout">Continue to checkout <ArrowRight size={16} /></Link></aside></div>}
    </div>
  )
}

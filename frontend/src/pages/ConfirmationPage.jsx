import React from 'react'
import { ArrowRight, Check, Clock3, ShoppingBag } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { getOrder } from '../services/api.js'
import { useEffect, useState } from 'react'
import { useCart } from '../context/CartContext.jsx'

export default function ConfirmationPage() {
  const { orderNumber } = useParams()
  const { items, subtotal } = useCart()
  const [order, setOrder] = useState(() => {
    try { return JSON.parse(sessionStorage.getItem('rushi-last-order') || 'null') } catch { return null }
  })
  const isCurrentOrder = order?.order_number === orderNumber
  useEffect(() => {
    if (isCurrentOrder) return
    getOrder(orderNumber).then(setOrder).catch(() => setOrder(null))
  }, [orderNumber, isCurrentOrder])

  if (order && order.order_number !== orderNumber) order = null
  const orderTotal = order?.total_amount
  const lineItems = order?.items || (isCurrentOrder ? order?.checkout_items : null) || []

  return <div className="page-shell inner-page confirmation-page"><div className="confirmation-mark"><Check size={27} /></div><span className="eyebrow"><i /> Passed to the kitchen</span><h1>We’ve got it.<br /><em>Thank you.</em></h1><p className="confirmation-intro">Your order is on its way to our kitchen. We’ll be in touch shortly to confirm the details.</p><div className="confirmation-card"><div><span>Order number</span><strong>{orderNumber}</strong></div><div><span>Status</span><strong className="status-pill">{order?.status || 'Pending'}</strong></div>{orderTotal != null && <div><span><ShoppingBag size={15} /> Order total</span><strong>{`Rs. ${Number(orderTotal).toLocaleString('en-LK')}`}</strong></div>}<div><span><Clock3 size={15} /> The next step</span><strong>We’ll call to confirm delivery.</strong></div></div>{lineItems.length > 0 && <div className="confirmation-items"><h2>On your order</h2>{lineItems.map((item) => { const lineTotal = item.subtotal ?? Number(item.unit_price ?? item.price ?? 0) * item.quantity; return <div key={item.food_id || item.id}><span>{item.food_name || item.name} × {item.quantity}</span><span>{`Rs. ${Number(lineTotal).toLocaleString('en-LK')}`}</span></div> })}</div>}<div className="confirmation-actions"><Link className="button" to="/orders">View my orders <ArrowRight size={16} /></Link><Link className="text-link" to="/menu">Back to the menu</Link></div>{!isCurrentOrder && !order && <p className="confirmation-lookup-note">For privacy, order details are available through order lookup with your checkout email.</p>}</div>
}

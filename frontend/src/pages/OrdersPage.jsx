import { ArrowRight, ClipboardList, Clock3 } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { getOrders } from '../services/api.js'

const money = (amount) => `Rs. ${Number(amount).toLocaleString('en-LK')}`

export default function OrdersPage() {
  const [email, setEmail] = useState('')
  const [orders, setOrders] = useState([])
  const [searched, setSearched] = useState(false)
  const [error, setError] = useState('')
  async function lookUp(event) {
    event.preventDefault(); setError('')
    try { setOrders(await getOrders(email)); setSearched(true) } catch { setError('We could not reach the order book. Please try again shortly.') }
  }
  return <div className="page-shell inner-page orders-page"><div className="inner-heading"><span className="eyebrow"><i /> Your place at the table</span><h1>Orders you’ve<br /><em>shared with us.</em></h1><p>Enter the email address you used at checkout to find your recent orders.</p></div><form className="order-search" onSubmit={lookUp}><label><span>Email address</span><input type="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" /></label><button className="button" type="submit">Find my orders <ArrowRight size={16} /></button></form>{error && <p className="form-error">{error}</p>}{searched && <div className="orders-results">{orders.length ? orders.map((order) => <article className="order-history-card" key={order.id}><span className="history-icon"><ClipboardList size={19} /></span><div><span className="food-category">{new Date(order.created_at).toLocaleDateString()}</span><h2>{order.order_number}</h2><p>{order.items.map((item) => `${item.food_name} × ${item.quantity}`).join(' · ')}</p></div><span className="status-pill">{order.status.replaceAll('_', ' ')}</span><strong>{money(order.total_amount)}</strong></article>) : <div className="empty-state"><span className="empty-symbol">ற</span><h2>No orders found for that address.</h2><p>If this is your first visit, we’d be happy to cook for you.</p><Link className="text-link" to="/menu">Take a look at the menu <ArrowRight size={15} /></Link></div>}</div>}<div className="orders-help"><Clock3 size={17} /><span>Just placed an order? It can take a moment to appear here.</span></div></div>
}

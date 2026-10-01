import { Link, NavLink } from 'react-router-dom'
import { ArrowUpRight, Menu, ShoppingBag, X } from 'lucide-react'
import { useState } from 'react'
import { useCart } from '../context/CartContext.jsx'
import { Brand } from './Brand.jsx'

const links = [['Home', '/'], ['Our menu', '/menu'], ['Our story', '/#story'], ['My orders', '/orders']]

export default function Header() {
  const { count } = useCart()
  const [open, setOpen] = useState(false)
  return (
    <header className="site-header">
      <div className="header-inner page-shell">
        <Brand />
        <button className="icon-button mobile-toggle" onClick={() => setOpen(!open)} aria-label={open ? 'Close navigation' : 'Open navigation'}>{open ? <X /> : <Menu />}</button>
        <nav className={`main-nav${open ? ' nav-open' : ''}`} aria-label="Main navigation">
          {links.map(([label, to]) => <NavLink key={label} to={to} onClick={() => setOpen(false)} className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>{label}</NavLink>)}
        </nav>
        <div className="header-actions">
          <Link className="cart-link" to="/cart" aria-label={`Cart, ${count} items`}><ShoppingBag size={19} /><span>Cart</span><b>{count}</b></Link>
          <Link className="button button-small" to="/menu">Order now <ArrowUpRight size={15} /></Link>
        </div>
      </div>
    </header>
  )
}

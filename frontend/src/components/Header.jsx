import React from 'react'
import { Link, NavLink } from 'react-router-dom'
import { ArrowUpRight, Menu, ShoppingBag, X } from 'lucide-react'
import { useState } from 'react'
import { useCart } from '../context/CartContext.jsx'
import { Brand } from './Brand.jsx'
import { useAuth } from '../context/AuthContext.jsx'

const links = [['Home', '/home'], ['Our menu', '/menu'], ['Our story', '/home#story']]

export default function Header() {
  const { count } = useCart()
  const { session } = useAuth()
  const [open, setOpen] = useState(false)
  return (
    <header className="site-header" id="top">
      <div className="header-inner page-shell">
        <Brand />
        <button className="icon-button mobile-toggle" onClick={() => setOpen(!open)} aria-label={open ? 'Close navigation' : 'Open navigation'} aria-expanded={open} aria-controls="primary-navigation">{open ? <X /> : <Menu />}</button>
        <nav id="primary-navigation" className={`main-nav${open ? ' nav-open' : ''}`} aria-label="Main navigation">
          {links.map(([label, to]) => <NavLink key={label} to={to} onClick={() => setOpen(false)} className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>{label}</NavLink>)}
        </nav>
        <div className="header-actions">
          <Link className="cart-link" to="/cart" aria-label={`Cart, ${count} items`}><ShoppingBag size={19} /><span>Cart</span><b>{count}</b></Link>
          <Link className="button button-small" to={session?.role === 'customer' ? '/dashboard' : '/login'}>{session?.role === 'customer' ? 'My account' : 'Sign in'} <ArrowUpRight size={15} /></Link>
        </div>
      </div>
    </header>
  )
}

import React, { useState } from 'react'
import { BarChart3, Box, ClipboardList, LayoutDashboard, LogOut, Users } from 'lucide-react'
import { Link } from 'react-router-dom'
import { createAdminCategory, deleteAdminCategory, getAdminCategories, getAdminCustomers, getAdminFoods, getAdminOrders, getDashboard, saveAdminFood, setOrderStatus } from '../services/api.js'
import { useAuth } from '../context/AuthContext.jsx'

const money = (amount) => `Rs. ${Number(amount || 0).toLocaleString('en-LK')}`
const detailMessage = (error, fallback) => {
  const detail = error.response?.data?.detail
  if (typeof detail === 'string') return detail
  if (Array.isArray(detail) && detail[0]?.msg) return detail[0].msg
  return fallback
}
const makeSlug = (value) => value.toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
const emptyFood = { name: '', slug: '', description: '', price: '', image_url: '', category_id: '', is_available: true }

export default function AdminWorkspace() {
  const { session, loading: authLoading, staffLogin, logout } = useAuth()
  const credentials = session?.role === 'admin' ? session : null
  const [login, setLogin] = useState({ username: '', password: '' })
  const [section, setSection] = useState('Overview')
  const [stats, setStats] = useState(null)
  const [orders, setOrders] = useState([])
  const [foods, setFoods] = useState([])
  const [categories, setCategories] = useState([])
  const [customers, setCustomers] = useState([])
  const [foodForm, setFoodForm] = useState(emptyFood)
  const [categoryName, setCategoryName] = useState('')
  const [notice, setNotice] = useState('')
  const [busy, setBusy] = useState(false)

  async function loadWorkspace() {
    const [dashboard, allOrders, allFoods, allCategories, allCustomers] = await Promise.all([
      getDashboard(), getAdminOrders(), getAdminFoods(), getAdminCategories(), getAdminCustomers(),
    ])
    setStats(dashboard); setOrders(allOrders); setFoods(allFoods); setCategories(allCategories); setCustomers(allCustomers)
  }

  async function signIn(event) {
    event.preventDefault(); setBusy(true); setNotice('')
    try {
      await staffLogin(login.username.trim(), login.password)
      await loadWorkspace()
      setNotice('Signed in to the kitchen desk.')
    } catch (error) {
      setNotice(error.response?.status === 503 ? 'Staff sign-in is not configured. Set ADMIN_USERNAME and ADMIN_PASSWORD in the API environment.' : error.response?.status === 401 ? 'Those staff sign-in details were not accepted.' : 'Could not load the kitchen desk. Check that the API and database are available.')
    } finally { setBusy(false) }
  }

  async function refresh() {
    if (!credentials) return
    try { await loadWorkspace() } catch { setNotice('Some kitchen desk information could not be refreshed.') }
  }

  async function changeStatus(order, status) {
    try {
      const updated = await setOrderStatus(order.id, status)
      setOrders((current) => current.map((item) => item.id === order.id ? updated : item))
      setNotice(`Order ${order.order_number} updated.`)
    } catch { setNotice('The order status could not be updated.') }
  }

  async function saveFood(event) {
    event.preventDefault(); setBusy(true); setNotice('')
    try {
      const payload = { ...foodForm, category_id: Number(foodForm.category_id), price: Number(foodForm.price) }
      const saved = await saveAdminFood(payload)
      setFoods((current) => payload.id ? current.map((food) => food.id === saved.id ? saved : food) : [...current, saved])
      setFoodForm(emptyFood); setNotice(`${saved.name} saved to the menu.`); await refresh()
    } catch (error) { setNotice(detailMessage(error, 'Could not save this menu item.')) } finally { setBusy(false) }
  }

  async function toggleFood(food) {
    try {
      await saveAdminFood({ id: food.id, is_available: !food.is_available })
      setFoods((current) => current.map((item) => item.id === food.id ? { ...item, is_available: !item.is_available } : item))
      setNotice(`${food.name} marked ${food.is_available ? 'unavailable' : 'available'}.`)
    } catch { setNotice('Could not update menu availability.') }
  }

  async function addCategory(event) {
    event.preventDefault(); setBusy(true)
    try {
      const category = await createAdminCategory({ name: categoryName.trim(), slug: makeSlug(categoryName) })
      setCategories((current) => [...current, category].sort((a, b) => a.name.localeCompare(b.name)))
      setCategoryName(''); setNotice(`${category.name} category added.`)
    } catch (error) { setNotice(detailMessage(error, 'Could not add this category.')) } finally { setBusy(false) }
  }

  async function removeCategory(category) {
    try {
      await deleteAdminCategory(category.id)
      setCategories((current) => current.filter((item) => item.id !== category.id)); setNotice(`${category.name} category removed.`)
    } catch (error) { setNotice(detailMessage(error, 'Move the categoryâ€™s menu items before removing it.')) }
  }

  function signOut() {
    logout().catch(() => {}); setLogin({ username: '', password: '' }); setStats(null); setOrders([]); setFoods([]); setCategories([]); setCustomers([]); setNotice('You are signed out.')
  }

  const nav = [['Overview', LayoutDashboard], ['Menu items', Box], ['Orders', ClipboardList], ['Customers', Users]]
  if (authLoading) return <main className="staff-login page-shell">Opening the kitchen desk…</main>
  if (!credentials) return <main className="staff-login page-shell"><Link className="text-link" to="/login">â† Back to Rushiâ€™s home page</Link><form className="staff-login-card" onSubmit={signIn}><span className="eyebrow"><i /> Staff workspace</span><h1>Welcome to the<br /><em>kitchen desk.</em></h1><p>Sign in with your staff account to manage the menu and customer orders.</p><label className="form-field"><span>Staff username</span><input autoComplete="username" required value={login.username} onChange={(event) => setLogin({ ...login, username: event.target.value })} /></label><label className="form-field"><span>Password</span><input type="password" autoComplete="current-password" required value={login.password} onChange={(event) => setLogin({ ...login, password: event.target.value })} /></label>{notice && <p className="form-error" role="alert">{notice}</p>}<button className="button button-full" type="submit" disabled={busy}>{busy ? 'Opening the deskâ€¦' : 'Sign in'}</button><small>Staff access must be configured by the site operator.</small></form></main>

  return <div className="admin-shell"><aside className="admin-sidebar"><Link to="/" className="admin-brand">Rushi<span>Kitchen desk</span></Link><span className="eyebrow">Manage the kitchen</span>{nav.map(([label, Icon]) => <button key={label} className={section === label ? 'admin-nav active' : 'admin-nav'} onClick={() => setSection(label)}><Icon size={17} /> {label}</button>)}<button className="admin-nav admin-signout" onClick={signOut}><LogOut size={16} /> Sign out</button><div className="sidebar-bottom">Jaffna vegetarian kitchen<br /><span>Staff workspace</span></div></aside><section className="admin-main"><div className="admin-topbar"><div><span className="eyebrow">Kitchen desk / {section}</span><h1>{section === 'Overview' ? 'A good day at Rushi.' : section}</h1></div><span className="admin-live"><i /> Staff signed in</span></div>{notice && <p className="admin-notice" role="status">{notice}</p>}{section === 'Overview' && <><div className="admin-stats">{[['Food on the menu', stats?.total_foods ?? 0, 'Recipes ready'], ['Orders to prepare', stats?.pending_orders ?? 0, 'Waiting for the kitchen'], ['Orders delivered', stats?.delivered_orders ?? 0, 'Sent out with care'], ['Gross revenue', money(stats?.total_revenue), 'All non-cancelled orders']].map(([label, value, note]) => <article className="admin-stat" key={label}><span>{label}</span><strong>{value}</strong><small>{note}</small></article>)}</div><div className="admin-workspace"><div className="admin-panel admin-orders-panel"><div className="admin-panel-heading"><div><span className="eyebrow">Fresh from the pass</span><h2>Recent orders</h2></div><button className="admin-filter" onClick={refresh}>Refresh</button></div><OrdersTable orders={orders.slice(0, 8)} onStatus={changeStatus} /></div><aside className="admin-panel kitchen-note"><span className="note-illustration"><BarChart3 size={20} /></span><span className="eyebrow">Today in the kitchen</span><h2>Cook with care.<br /><em>Send it with warmth.</em></h2><p>Manage incoming orders and keep customers up to date as their meal makes its way from our kitchen.</p><div className="kitchen-metric"><span>Customers</span><strong>{stats?.total_customers ?? 0}</strong></div><div className="kitchen-metric"><span>Categories</span><strong>{stats?.total_categories ?? 0}</strong></div></aside></div></>}{section === 'Orders' && <div className="admin-panel"><div className="admin-panel-heading"><div><span className="eyebrow">The kitchen book</span><h2>All customer orders</h2></div><button className="admin-filter" onClick={refresh}>Refresh</button></div><OrdersTable orders={orders} onStatus={changeStatus} /></div>}{section === 'Menu items' && <div className="admin-workspace admin-menu-workspace"><div className="admin-panel"><div className="admin-panel-heading"><div><span className="eyebrow">The menu</span><h2>{foodForm.id ? 'Edit a dish' : 'Add a dish'}</h2></div>{foodForm.id && <button className="admin-filter" onClick={() => setFoodForm(emptyFood)}>Cancel edit</button>}</div><form className="admin-food-form" onSubmit={saveFood}><label className="form-field"><span>Dish name</span><input required minLength="2" value={foodForm.name} onChange={(event) => setFoodForm({ ...foodForm, name: event.target.value, slug: makeSlug(event.target.value) })} /></label><label className="form-field"><span>Menu category</span><select required value={foodForm.category_id} onChange={(event) => setFoodForm({ ...foodForm, category_id: event.target.value })}><option value="">Choose a category</option>{categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</select></label><label className="form-field"><span>Price (LKR)</span><input required type="number" min="1" step="0.01" value={foodForm.price} onChange={(event) => setFoodForm({ ...foodForm, price: event.target.value })} /></label><label className="form-field"><span>Description</span><textarea rows="3" value={foodForm.description || ''} onChange={(event) => setFoodForm({ ...foodForm, description: event.target.value })} /></label><label className="form-field"><span>Image URL or path</span><input value={foodForm.image_url || ''} onChange={(event) => setFoodForm({ ...foodForm, image_url: event.target.value })} placeholder="/assets/food/dish.png" /></label><button className="button" type="submit" disabled={busy}>{foodForm.id ? 'Save changes' : 'Add to menu'}</button></form><div className="category-manager"><h3>Menu categories</h3><form className="category-form" onSubmit={addCategory}><input aria-label="New category name" minLength="2" required value={categoryName} onChange={(event) => setCategoryName(event.target.value)} placeholder="New category name" /><button className="admin-filter" disabled={busy}>Add category</button></form><div className="category-chips">{categories.map((category) => <span key={category.id}>{category.name}<button aria-label={`Remove ${category.name}`} onClick={() => removeCategory(category)}>Ã—</button></span>)}</div></div></div><div className="admin-panel"><div className="admin-panel-heading"><div><span className="eyebrow">Available dishes</span><h2>Current menu</h2></div></div><div className="admin-food-list">{foods.map((food) => <article key={food.id}><div><strong>{food.name}</strong><span>{categories.find((category) => category.id === food.category_id)?.name || 'Kitchen'} Â· {money(food.price)}</span></div><span className={food.is_available ? 'food-available' : 'food-unavailable'}>{food.is_available ? 'Available' : 'Hidden'}</span><button className="admin-filter" onClick={() => setFoodForm({ ...food, price: String(food.price), category_id: String(food.category_id) })}>Edit</button><button className="admin-filter" onClick={() => toggleFood(food)}>{food.is_available ? 'Hide' : 'Show'}</button></article>)}{foods.length === 0 && <div className="admin-empty">No dishes yet. Add the first one here.</div>}</div></div></div>}{section === 'Customers' && <div className="admin-panel"><div className="admin-panel-heading"><div><span className="eyebrow">The community</span><h2>Customer list</h2><p>Customer contact details are visible only to signed-in staff.</p></div><button className="admin-filter" onClick={refresh}>Refresh</button></div><div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Name</th><th>Email</th><th>Phone</th><th>Delivery address</th><th>Orders</th></tr></thead><tbody>{customers.map((customer) => <tr key={customer.id}><td>{customer.name}</td><td><a href={`mailto:${encodeURIComponent(customer.email)}`}>{customer.email}</a></td><td><a href={`tel:${encodeURIComponent(customer.phone)}`}>{customer.phone}</a></td><td className="customer-address">{customer.address}</td><td>{customer.order_count}</td></tr>)}</tbody></table>{customers.length === 0 && <div className="admin-empty">Customers will appear here after their first order.</div>}</div></div>}</section></div>
}

function OrdersTable({ orders, onStatus }) {
  if (!orders.length) return <div className="admin-empty"><ClipboardList size={22} /><span>Orders will appear here after checkout.</span></div>
  return <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Order</th><th>Customer</th><th>Dishes</th><th>Amount</th><th>Status</th><th>Update</th></tr></thead><tbody>{orders.map((order) => <tr key={order.id}><td>{order.order_number}</td><td>Customer #{order.customer_id}</td><td>{order.items.map((item) => `${item.food_name} Ã— ${item.quantity}`).join(', ')}</td><td>{money(order.total_amount)}</td><td><span className={`status-pill status-${order.status}`}>{order.status.replaceAll('_', ' ')}</span></td><td><select aria-label={`Update ${order.order_number}`} value={order.status} onChange={(event) => onStatus(order, event.target.value)}>{['pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'].map((status) => <option key={status} value={status}>{status.replaceAll('_', ' ')}</option>)}</select></td></tr>)}</tbody></table></div>
}

import React, { useEffect, useState } from 'react'
import { ArrowRight, Leaf } from 'lucide-react'
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { registerCustomer, requestPasswordReset, resetPassword, verifyEmail } from '../services/api.js'

const messageOf = (error) => error.response?.data?.detail || 'We could not complete that request. Please try again.'

function AuthFrame({ eyebrow, title, children, footer }) {
  return <main className="auth-page"><div className="auth-art"><span className="auth-mark"><Leaf /></span><span className="eyebrow"><i /> A Jaffna vegetarian kitchen</span><h1>Good food<br />begins with<br /><em>being together.</em></h1><p>Make yourself at home. Your table is waiting.</p><span className="auth-art-caption">RUSHI · JAFFNA</span></div><section className="auth-panel"><Link className="auth-wordmark" to="/">Rushi<span>JAFFNA VEGETARIAN KITCHEN</span></Link><div className="auth-form-wrap"><span className="eyebrow"><i /> {eyebrow}</span><h2>{title}</h2>{children}{footer && <div className="auth-footer">{footer}</div>}</div></section></main>
}

export function LoginPage() {
  const { session, loading, login } = useAuth(); const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' }); const [error, setError] = useState(''); const [busy, setBusy] = useState(false)
  if (!loading && session) return <Navigate to={session.role === 'admin' ? '/admin' : '/dashboard'} replace />
  async function submit(event) { event.preventDefault(); setBusy(true); setError(''); try { const result = await login(form.email, form.password); navigate(result.role === 'admin' ? '/admin' : '/dashboard') } catch (err) { setError(messageOf(err)) } finally { setBusy(false) } }
  return <AuthFrame eyebrow="Welcome back" title={<>Come on in.<br /><em>Your table awaits.</em></>} footer={<>New to Rushi? <Link to="/register">Create an account <ArrowRight size={14} /></Link></>}><form className="account-form" onSubmit={submit}><label className="form-field"><span>Email address</span><input type="email" autoComplete="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" /></label><label className="form-field"><span>Password</span><input type="password" autoComplete="current-password" required value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} placeholder="Your password" /></label><div className="auth-inline"><span>We’re glad you’re here.</span><Link to="/forgot-password">Forgot password?</Link></div>{error && <p className="form-error" role="alert">{error}</p>}<button className="button button-full" disabled={busy}>{busy ? 'Signing you in…' : 'Sign in'} <ArrowRight size={16} /></button><p className="auth-secure">Your account and order history are private to you.</p></form></AuthFrame>
}

export function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '' }); const [error, setError] = useState(''); const [notice, setNotice] = useState(''); const [busy, setBusy] = useState(false)
  async function submit(event) { event.preventDefault(); setBusy(true); setError(''); try { const result = await registerCustomer(form); setNotice(result.message) } catch (err) { setError(messageOf(err)) } finally { setBusy(false) } }
  return <AuthFrame eyebrow="A place at our table" title={<>Make it yours.<br /><em>Join the family.</em></>} footer={<>Already have an account? <Link to="/login">Sign in <ArrowRight size={14} /></Link></>}><form className="account-form" onSubmit={submit}><label className="form-field"><span>Your name</span><input autoComplete="name" required minLength="2" maxLength="160" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="How should we greet you?" /></label><label className="form-field"><span>Email address</span><input type="email" autoComplete="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" /></label><label className="form-field"><span>Create a password</span><input type="password" autoComplete="new-password" minLength="12" maxLength="128" required value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} placeholder="At least 12 characters" /></label><p className="auth-hint">Use 12 or more characters. We’ll email you a link to verify your address.</p>{error && <p className="form-error" role="alert">{error}</p>}{notice && <p className="form-success" role="status">{notice}</p>}<button className="button button-full" disabled={busy}>{busy ? 'Preparing your invitation…' : 'Create my account'} <ArrowRight size={16} /></button></form></AuthFrame>
}

export function VerifyEmailPage() {
  const [params] = useSearchParams(); const { setSession } = useAuth(); const navigate = useNavigate(); const [error, setError] = useState('')
  useEffect(() => { const token = params.get('token'); if (!token) { setError('This verification link is incomplete.'); return } verifyEmail(token).then(result => { setSession(result); navigate('/dashboard', { replace: true }) }).catch(err => setError(messageOf(err))) }, [])
  return <AuthFrame eyebrow="One last step" title={<>Setting your<br /><em>place at the table.</em></>}><p className={error ? 'form-error' : 'auth-hint'}>{error || 'Verifying your email address…'}</p>{error && <Link className="button" to="/register">Try again <ArrowRight size={16} /></Link>}</AuthFrame>
}

export function ForgotPasswordPage() {
  const [email, setEmail] = useState(''); const [notice, setNotice] = useState(''); const [error, setError] = useState(''); const [busy, setBusy] = useState(false)
  async function submit(event) { event.preventDefault(); setBusy(true); setError(''); try { const result = await requestPasswordReset(email); setNotice(result.message) } catch (err) { setError(messageOf(err)) } finally { setBusy(false) } }
  return <AuthFrame eyebrow="Find your way back" title={<>A fresh start,<br /><em>whenever you need.</em></>} footer={<><Link to="/login">Back to sign in</Link></>}><form className="account-form" onSubmit={submit}><label className="form-field"><span>Email address</span><input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" /></label>{error && <p className="form-error" role="alert">{error}</p>}{notice && <p className="form-success" role="status">{notice}</p>}<button className="button button-full" disabled={busy}>{busy ? 'Sending…' : 'Send reset link'} <ArrowRight size={16} /></button></form></AuthFrame>
}

export function ResetPasswordPage() {
  const [params] = useSearchParams(); const navigate = useNavigate(); const [password, setPassword] = useState(''); const [error, setError] = useState(''); const [notice, setNotice] = useState('')
  async function submit(event) { event.preventDefault(); try { await resetPassword(params.get('token'), password); setNotice('Your password has been changed. You can sign in now.'); setTimeout(() => navigate('/login', { replace: true }), 1300) } catch (err) { setError(messageOf(err)) } }
  return <AuthFrame eyebrow="A fresh start" title={<>Choose a new<br /><em>secret phrase.</em></>} footer={<Link to="/login">Back to sign in</Link>}><form className="account-form" onSubmit={submit}><label className="form-field"><span>New password</span><input type="password" required minLength="12" maxLength="128" autoComplete="new-password" value={password} onChange={e => setPassword(e.target.value)} placeholder="At least 12 characters" /></label>{error && <p className="form-error" role="alert">{error}</p>}{notice && <p className="form-success" role="status">{notice}</p>}<button className="button button-full">Save new password <ArrowRight size={16} /></button></form></AuthFrame>
}

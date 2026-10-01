import { ArrowUpRight, Instagram, MapPin } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Brand } from './Brand.jsx'

export default function Footer() {
  return (
    <footer className="site-footer" id="contact">
      <div className="page-shell footer-main">
        <div className="footer-brand"><Brand light /><p>Traditional vegetarian cooking from Jaffna and South India, made to be shared.</p></div>
        <div className="footer-links"><span className="eyebrow">Find your way</span><Link to="/menu">The menu</Link><Link to="/orders">Your orders</Link><a href="mailto:hello@rushi.lk">Get in touch <ArrowUpRight size={14} /></a></div>
        <div className="footer-links"><span className="eyebrow">Come by</span><span><MapPin size={15} /> Jaffna, Sri Lanka</span><a href="https://instagram.com" target="_blank" rel="noreferrer"><Instagram size={15} /> Follow along</a></div>
      </div>
      <div className="page-shell footer-bottom"><span>© {new Date().getFullYear()} Rushi Kitchen</span><span>Cooked with care in Jaffna</span><a href="#top">Back to top ↑</a></div>
    </footer>
  )
}

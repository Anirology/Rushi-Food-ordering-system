import { ArrowRight, Check, Clock3, MapPin } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'

export default function ConfirmationPage() {
  const { orderNumber } = useParams()
  let order = null
  try { order = JSON.parse(sessionStorage.getItem('rushi-last-order') || 'null') } catch { order = null }
  return <div className="page-shell inner-page confirmation-page"><div className="confirmation-mark"><Check size={27} /></div><span className="eyebrow"><i /> Passed to the kitchen</span><h1>We’ve got it.<br /><em>Thank you.</em></h1><p className="confirmation-intro">Your order is on its way to our kitchen. We’ll be in touch shortly to confirm the details.</p><div className="confirmation-card"><div><span>Order number</span><strong>{orderNumber}</strong></div><div><span>Status</span><strong className="status-pill">{order?.status || 'Pending'}</strong></div><div><span><Clock3 size={15} /> The next step</span><strong>We’ll call to confirm delivery.</strong></div><div><span><MapPin size={15} /> Delivering to</span><strong>{order?.customer?.address || 'Your chosen address'}</strong></div></div><div className="confirmation-actions"><Link className="button" to="/orders">View my orders <ArrowRight size={16} /></Link><Link className="text-link" to="/menu">Back to the menu</Link></div></div>
}

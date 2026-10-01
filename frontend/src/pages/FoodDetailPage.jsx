import React from 'react'
import { ArrowLeft, ArrowRight, Check, Plus } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useCart } from '../context/CartContext.jsx'
import { foodImage, sampleFoods } from '../data/menu.js'
import { getFood } from '../services/api.js'

const money = (amount) => `Rs. ${Number(amount).toLocaleString('en-LK')}`

export default function FoodDetailPage() {
  const { foodId } = useParams()
  const { items, add } = useCart()
  const cartItem = items.find((item) => String(item.id) === foodId)
  const [food, setFood] = useState(() => sampleFoods.find((item) => String(item.id) === foodId || item.slug === foodId) || null)
  const [loading, setLoading] = useState(true)
  const [added, setAdded] = useState(false)

  useEffect(() => {
    let active = true
    setLoading(true)
    getFood(foodId)
      .then((item) => active && setFood({ ...item, category: item.category?.name || sampleFoods.find((sample) => sample.category_id === item.category_id)?.category || 'From our kitchen' }))
      .catch(() => {})
      .finally(() => active && setLoading(false))
    return () => { active = false }
  }, [foodId])

  function addToCart() {
    if (!food) return
    add(food)
    setAdded(true)
    window.setTimeout(() => setAdded(false), 1800)
  }

  if (loading && !food) return <div className="page-shell inner-page"><p className="eyebrow">A moment, please</p><h1 className="detail-loading">Bringing up the menu.</h1></div>
  if (!food) return <div className="page-shell inner-page empty-state"><span className="empty-symbol">ற</span><h2>We couldn’t find that dish.</h2><p>It may have moved off today’s menu.</p><Link className="button" to="/menu">Return to the menu <ArrowRight size={16} /></Link></div>

  return (
    <div className="page-shell inner-page food-detail-page">
      <Link className="text-link detail-back" to="/menu"><ArrowLeft size={15} /> Back to all dishes</Link>
      <div className="food-detail-layout">
        <div className="food-detail-image"><img src={foodImage(food)} alt={food.name} /><span className="food-tag">{food.tag || food.category}</span></div>
        <section className="food-detail-copy">
          <span className="eyebrow"><i /> {food.category || 'From our kitchen'}</span>
          <h1>{food.name}</h1>
          <p className="food-detail-description">{food.description || 'A much-loved dish from our kitchen, prepared fresh with traditional ingredients and care.'}</p>
          <strong className="food-detail-price">{money(food.price)}</strong>
          <div className="detail-availability"><span /> Prepared fresh after you order</div>
          <button className="button detail-add" onClick={addToCart}><Plus size={16} /> {added ? 'Added to your order' : 'Add to your order'} <ArrowRight size={16} /></button>
          {added && <p className="detail-added" role="status"><Check size={15} /> In your cart{cartItem ? ` · ${cartItem.quantity + 1} altogether` : ''}</p>}
          <div className="detail-note"><span>From our kitchen</span><p>Traditional vegetarian cooking from Jaffna and South India, made to be shared.</p></div>
        </section>
      </div>
    </div>
  )
}

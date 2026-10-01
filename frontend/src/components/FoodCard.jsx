import React from 'react'
import { ArrowUpRight, Plus } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext.jsx'
import { foodImage } from '../data/menu.js'

const money = (amount) => `Rs. ${Number(amount).toLocaleString('en-LK')}`

export default function FoodCard({ food, index = 0 }) {
  const { add } = useCart()
  return (
    <article className="food-card" style={{ '--card-index': index }}>
      <Link className="food-image-link" to={`/menu/${food.id}`} aria-label={`View ${food.name}`}>
        <img className="food-image" src={foodImage(food)} alt={food.name} loading="lazy" />
        <span className="food-tag">{food.tag || food.category || 'From our kitchen'}</span>
        <span className="image-arrow"><ArrowUpRight size={17} /></span>
      </Link>
      <div className="food-card-content">
        <div><span className="food-category">{food.category || 'Jaffna kitchen'}</span><h3>{food.name}</h3></div>
        <p>{food.description}</p>
        <div className="food-card-bottom"><strong>{money(food.price)}</strong><button className="add-button" onClick={() => add(food)} aria-label={`Add ${food.name} to cart`}><Plus size={16} /> Add</button></div>
      </div>
    </article>
  )
}

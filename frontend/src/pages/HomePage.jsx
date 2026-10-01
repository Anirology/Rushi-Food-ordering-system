import React from 'react'
import { useEffect, useState } from 'react'
import { ArrowDownRight, ArrowRight, Leaf, MoveUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import FoodCard from '../components/FoodCard.jsx'
import { sampleFoods } from '../data/menu.js'
import { getFoods } from '../services/api.js'

export default function HomePage() {
  const [featuredFoods, setFeaturedFoods] = useState(sampleFoods.slice(0, 3))
  useEffect(() => {
    let active = true
    getFoods({ page: 1, limit: 3, available_only: true })
      .then((foods) => { if (active && foods?.length) setFeaturedFoods(foods) })
      .catch(() => {})
    return () => { active = false }
  }, [])
  return (
    <>
      <section className="hero-section page-shell">
        <div className="hero-copy">
          <span className="eyebrow"><i /> A Jaffna vegetarian kitchen</span>
          <h1>The taste of Jaffna,<br /><em>made for sharing.</em></h1>
          <p className="hero-description">Traditional vegetarian dishes from Jaffna and South India, prepared with care and served with warmth.</p>
          <div className="hero-actions"><Link className="button" to="/menu">Explore the menu <ArrowRight size={17} /></Link><a className="text-link" href="#story">A little about us <ArrowDownRight size={16} /></a></div>
          <div className="hero-note"><span className="note-icon"><Leaf size={17} /></span><span>Made slowly, shared generously.<br /><b>Always vegetarian.</b></span></div>
          <img className="hero-ornament" src="/assets/brand/kolam-saffron.png" alt="" aria-hidden="true" />
        </div>
        <div className="hero-visual">
          <img src="/assets/food/banana-leaf-meal.png" alt="A traditional vegetarian meal served on a banana leaf" />
          <div className="hero-image-caption"><span>From our table to yours</span><span>01 — 05</span></div>
          <div className="hero-side-note">JAFFNA <span>·</span> SOUTH INDIA <span>·</span> VEGETARIAN</div>
        </div>
      </section>

      <section className="intro-strip" id="story">
        <div className="page-shell intro-inner"><span className="eyebrow">A kitchen with roots</span><p>Recipes carried through generations.<br />A place at the table for <em>everyone.</em></p><span className="intro-mark">R.</span></div>
      </section>

      <section className="featured-section page-shell">
        <div className="section-heading"><div><span className="eyebrow">A few favourites</span><h2>From our kitchen, <em>with love.</em></h2></div><Link className="text-link" to="/menu">See the full menu <ArrowRight size={16} /></Link></div>
        <div className="food-grid">{featuredFoods.map((food, index) => <FoodCard key={food.id} food={food} index={index} />)}</div>
      </section>

      <section className="story-section page-shell">
        <div className="story-photo"><img src="/assets/food/string-hoppers.png" alt="Fresh string hoppers ready to be served" /><span className="photo-label">A familiar kind of comfort</span></div>
        <div className="story-copy"><span className="eyebrow">A little about Rushi</span><h2>Good food has a way of bringing us <em>home.</em></h2><p>At Rushi, we bring the flavours of Jaffna and South India to the table through traditional vegetarian cooking, made with care and meant to be shared.</p><Link className="text-link" to="/menu">Find something you love <MoveUpRight size={16} /></Link><span className="story-flourish">ற</span></div>
      </section>

      <section className="closing-callout"><div className="callout-inner page-shell"><span className="eyebrow">Gather around</span><h2>There’s always room<br />for <em>one more.</em></h2><Link className="button button-light" to="/menu">Order from our kitchen <ArrowRight size={16} /></Link><span className="callout-decoration">Rushi</span></div></section>
    </>
  )
}

import React from 'react'
import { useEffect, useState } from 'react'
import { ArrowDownRight, ArrowRight, Leaf, MoveUpRight, Sparkles } from 'lucide-react'
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
  useEffect(() => {
    const sections = document.querySelectorAll('.reveal-section')
    if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      sections.forEach((section) => section.classList.add('is-visible'))
      return undefined
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible')
          observer.unobserve(entry.target)
        }
      })
    }, { threshold: 0.14, rootMargin: '0px 0px -45px 0px' })
    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [])
  return (
    <>
      <section className="hero-section page-shell">
        <div className="hero-copy">
          <span className="eyebrow hero-eyebrow"><i /> A Jaffna vegetarian kitchen <span className="hero-sparkle"><Sparkles size={13} /></span></span>
          <h1>The taste of Jaffna,<br /><em>made for sharing.</em></h1>
          <p className="hero-description">Traditional vegetarian dishes from Jaffna and South India, prepared with care and served with warmth.</p>
          <div className="hero-actions"><Link className="button hero-primary" to="/menu"><span>Explore the menu</span><ArrowRight size={17} /></Link><a className="text-link hero-story-link" href="#story">A little about us <ArrowDownRight size={16} /></a></div>
          <div className="hero-note"><span className="note-icon"><Leaf size={17} /></span><span>Made slowly, shared generously.<br /><b>Always vegetarian.</b></span><span className="hero-note-rule" /></div>
          <img className="hero-ornament" src="/assets/brand/kolam-saffron.png" alt="" aria-hidden="true" />
        </div>
        <div className="hero-visual hero-reveal">
          <img src="/assets/food/banana-leaf-meal.png" alt="A traditional vegetarian meal served on a banana leaf" />
          <span className="hero-image-index">01 <i /> 05</span>
          <div className="hero-image-stamp"><span>R.</span><small>made with care</small></div>
          <div className="hero-image-caption"><span>From our table to yours</span><span>01 — 05</span></div>
          <div className="hero-side-note">JAFFNA <span>·</span> SOUTH INDIA <span>·</span> VEGETARIAN</div>
        </div>
        <div className="hero-bottom-note"><span>01 — A kitchen with roots</span><a href="#story" aria-label="Scroll to our story"><ArrowDownRight size={17} /></a><span>Freshly prepared · Always vegetarian</span></div>
      </section>

      <section className="intro-strip reveal-section" id="story">
        <div className="page-shell intro-inner"><span className="eyebrow">A kitchen with roots</span><p>Recipes carried through generations.<br />A place at the table for <em>everyone.</em></p><span className="intro-mark">R.</span></div>
      </section>

      <section className="featured-section page-shell reveal-section">
        <div className="section-heading"><div><span className="eyebrow">A few favourites</span><h2>From our kitchen, <em>with love.</em></h2></div><Link className="text-link" to="/menu">See the full menu <ArrowRight size={16} /></Link></div>
        <div className="food-grid">{featuredFoods.map((food, index) => <FoodCard key={food.id} food={food} index={index} />)}</div>
      </section>

      <section className="story-section page-shell reveal-section">
        <div className="story-photo"><img src="/assets/food/string-hoppers.png" alt="Fresh string hoppers ready to be served" /><span className="photo-label">A familiar kind of comfort</span></div>
        <div className="story-copy"><span className="eyebrow">A little about Rushi</span><h2>Good food has a way of bringing us <em>home.</em></h2><p>At Rushi, we bring the flavours of Jaffna and South India to the table through traditional vegetarian cooking, made with care and meant to be shared.</p><Link className="text-link" to="/menu">Find something you love <MoveUpRight size={16} /></Link><span className="story-flourish">ற</span></div>
      </section>

      <section className="closing-callout"><div className="callout-inner page-shell"><span className="eyebrow">Gather around</span><h2>There’s always room<br />for <em>one more.</em></h2><Link className="button button-light" to="/menu">Order from our kitchen <ArrowRight size={16} /></Link><span className="callout-decoration">Rushi</span></div></section>
    </>
  )
}

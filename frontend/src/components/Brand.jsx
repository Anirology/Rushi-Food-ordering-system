import React from 'react'
import { Link } from 'react-router-dom'

export function Brand({ light = false, compact = false }) {
  return (
    <Link className={`brand${light ? ' brand-light' : ''}${compact ? ' brand-compact' : ''}`} to="/" aria-label="Rushi home">
      <span className="brand-name">Rushi</span>
      {!compact && <span className="brand-caption">Jaffna vegetarian kitchen</span>}
    </Link>
  )
}

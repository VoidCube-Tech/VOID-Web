// Adapted from Skiper UI `skiper40` (Animated Link).
// Free component license requires attribution: https://skiper-ui.com/
import React from 'react'
import { Link } from 'react-router-dom'

function ArrowGlyph() {
  return <svg className="skiper-link__arrow" fill="none" viewBox="0 0 10 10" aria-hidden="true"><path d="M1.004 9.166 9.337.833m0 0v8.333m0-8.333H1.004" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" /></svg>
}

export function SkiperLink({ children, href, className = '', variant = 'line', external = false, ...props }) {
  const classes = `skiper-link skiper-link--${variant} ${className}`.trim()
  const isExternal = external || /^(https?:|mailto:|tel:)/.test(href)
  if (isExternal) return <a href={href} className={classes} target={external ? '_blank' : undefined} rel={external ? 'noreferrer' : undefined} {...props}>{children}<ArrowGlyph /></a>
  return <Link to={href} className={classes} {...props}>{children}<ArrowGlyph /></Link>
}

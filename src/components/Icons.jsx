import React from 'react'

export function ArrowIcon({ size = 18, className = '' }) {
  return <svg className={className} width={size} height={size} viewBox="0 0 18 18" fill="none" aria-hidden="true">
    <path d="M3.5 14.5 14 4m0 0H6.2M14 4v7.8" stroke="currentColor" strokeWidth="1.35" strokeLinecap="square" />
  </svg>
}

export function MenuIcon({ open = false }) {
  return <span className={open ? 'menu-icon is-open' : 'menu-icon'} aria-hidden="true"><i /><i /></span>
}

export function CapabilityIcon({ type }) {
  if (type === 'automate') return <svg viewBox="0 0 32 32" fill="none" aria-hidden="true"><path d="M5 10h8l3 6h11M5 22h8l3-6"/><circle cx="5" cy="10" r="2"/><circle cx="5" cy="22" r="2"/><circle cx="27" cy="16" r="2"/></svg>
  if (type === 'connect') return <svg viewBox="0 0 32 32" fill="none" aria-hidden="true"><circle cx="7" cy="16" r="3"/><circle cx="25" cy="8" r="3"/><circle cx="25" cy="24" r="3"/><path d="m10 15 12-6M10 17l12 6"/></svg>
  return <svg viewBox="0 0 32 32" fill="none" aria-hidden="true"><path d="M9 5H5v22h4M23 5h4v22h-4M12 11h8M12 16h8M12 21h5"/></svg>
}

import React from 'react'

export let Icons = {
  web: "web",
  automation: "automation",
  map: "map",
}

export function ArrowIcon({ size = 18, className = '' }) {
  return <svg className={className} width={size} height={size} viewBox="0 0 18 18" fill="none" aria-hidden="true">
    <path d="M3.5 14.5 14 4m0 0H6.2M14 4v7.8" stroke="currentColor" strokeWidth="1.35" strokeLinecap="square" />
  </svg>
}

export function MenuIcon({ open = false }) {
  return <span className={open ? 'menu-icon is-open' : 'menu-icon'} aria-hidden="true"><i /><i /></span>
}

/**
 * 
 * @param {string} param0 
 * @returns
 */
export function CapabilityIcon({ type }) {
  return <span className="material-symbols-outlined" style={{ fontSize: '32px' }}>{type}</span>
}

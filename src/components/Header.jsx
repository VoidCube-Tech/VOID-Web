import { useEffect, useRef, useState } from 'react'
import { navigation } from '../content/siteContent'
import { ArrowIcon, MenuIcon } from './Icons'
import { Logo } from "./Logo"
import { Link, useLocation } from 'react-router-dom'
import "../style/header.css"

export function Header() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const navRef = useRef(null)
  const menuButtonRef = useRef(null)
  const location = useLocation()
    
  useEffect(() => setOpen(false), [location.pathname, location.hash])
  useEffect(() => {
    let frame = 0
    const onScroll = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => setScrolled(window.scrollY > 18))
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => { cancelAnimationFrame(frame); window.removeEventListener('scroll', onScroll) }
  }, [])
  useEffect(() => {
    document.documentElement.classList.toggle('menu-open', open)
    if (!open) return () => document.documentElement.classList.remove('menu-open')

    const nav = navRef.current
    const button = menuButtonRef.current
    const outside = [document.getElementById('main-content'), document.querySelector('.site-footer')]
      .filter(Boolean)
      .map(element => ({ element, inert: element.inert }))
    outside.forEach(({ element }) => { element.inert = true })

    const frame = requestAnimationFrame(() => nav?.querySelector('a[href]')?.focus({ preventScroll: true }))
    const handleKeyDown = event => {
      if (event.key === 'Escape') {
        event.preventDefault()
        setOpen(false)
        return
      }
      if (event.key !== 'Tab' || !nav || !button) return
      const controls = [...nav.querySelectorAll('a[href]'), button].filter(element => !element.hasAttribute('disabled'))
      const first = controls[0]
      const last = controls[controls.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      cancelAnimationFrame(frame)
      outside.forEach(({ element, inert }) => { element.inert = inert })
      document.documentElement.classList.remove('menu-open')
      window.removeEventListener('keydown', handleKeyDown)
      button?.focus({ preventScroll: true })
    }
  }, [open])


  const isCurrent = href => {
    if (href.includes('#')) return location.pathname === href.split('#')[0] && location.hash === `#${href.split('#')[1]}`
    return href === '/' ? location.pathname === '/' : location.pathname.startsWith(href)
  }

  return <header className={scrolled ? 'site-header is-scrolled' : 'site-header'}>
    <Logo />
    <nav ref={navRef} id="main-navigation" className={open ? 'site-nav is-open' : 'site-nav'} aria-label="Navegação principal">
      {navigation.map(item => <Link key={item.href} to={item.href} aria-current={isCurrent(item.href) ? 'page' : undefined}>{item.label}</Link>)}
      <Link className="header-cta" to="/contato" aria-current={location.pathname === '/contato' ? 'page' : undefined}>Iniciar projeto <ArrowIcon size={15} /></Link>
    </nav>
    <button ref={menuButtonRef} className="menu-button" type="button" onClick={() => setOpen(value => !value)} aria-expanded={open} aria-controls="main-navigation" aria-label={open ? 'Fechar menu' : 'Abrir menu'}><MenuIcon open={open} /></button>
  </header>
}
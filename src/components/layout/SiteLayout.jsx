import React, { useEffect, useLayoutEffect, useState } from 'react'
import { AnimatePresence, motion, useScroll } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { navigation } from '../../content/siteContent'
import { SkiperLink } from '../skiper/AnimatedLink'

export function Logo() {
  return <Link className="logo" to="/" aria-label="Void Systems — início"><span className="logo-mark" aria-hidden="true"><i /><i /><i /></span><span>VOID<span className="logo-thin">/SYSTEMS</span></span></Link>
}

function Header() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [theme, setTheme] = useState('transparent')
  const location = useLocation()

  useEffect(() => setOpen(false), [location.pathname])
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    addEventListener('scroll', onScroll, { passive: true })
    return () => removeEventListener('scroll', onScroll)
  }, [])
  useEffect(() => {
    let observer
    const frame = requestAnimationFrame(() => {
      const sections = document.querySelectorAll('[data-header-theme]')
      observer = new IntersectionObserver(entries => {
        const visible = entries.find(entry => entry.isIntersecting)
        if (visible) setTheme(visible.target.dataset.headerTheme || 'dark')
      }, { rootMargin: '-1px 0px -88% 0px', threshold: 0 })
      sections.forEach(section => observer.observe(section))
    })
    return () => { cancelAnimationFrame(frame); observer?.disconnect() }
  }, [location.pathname])
  useEffect(() => {
    if (!open) return undefined
    const close = event => { if (event.key === 'Escape') setOpen(false) }
    addEventListener('keydown', close)
    return () => removeEventListener('keydown', close)
  }, [open])

  return <header className="header" data-theme={scrolled ? theme : 'transparent'} data-scrolled={scrolled}>
    <Logo />
    <nav id="main-navigation" className={open ? 'nav open' : 'nav'} aria-label="Navegação principal">
      {navigation.map(item => <Link key={item.href} to={item.href} onClick={() => setOpen(false)}>{item.label}</Link>)}
      <SkiperLink href="/contato" onClick={() => setOpen(false)} className="nav-cta" variant="line">Iniciar projeto</SkiperLink>
    </nav>
    <button className="menu" onClick={() => setOpen(value => !value)} aria-expanded={open} aria-controls="main-navigation" aria-label={open ? 'Fechar menu' : 'Abrir menu'}>{open ? <X /> : <Menu />}</button>
  </header>
}

function Footer() {
  return <footer className="site-footer"><Logo/><p>Engenharia feita perto de quem usa.</p><nav aria-label="Navegação do rodapé"><Link to="/">Início</Link><Link to="/sobre">Sobre</Link><Link to="/blog">Blog</Link><Link to="/contato">Contato</Link><SkiperLink href="https://skiper-ui.com/" external variant="line">Skiper UI</SkiperLink></nav><span>© 2026 Void Systems</span></footer>
}

function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  return <motion.div className="progress" style={{ scaleX: scrollYProgress }} aria-hidden="true" />
}

function ScrollReveal() {
  const location = useLocation()

  useLayoutEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined

    const selector = [
      '.section-head', '.case', '.about-copy', '.journal-title', '.post-entry',
      '.inner-hero > *', '.about-hero > *', '.article-hero > *',
      '.blog-filters', '.blog-list__item', '.article-body > *',
      '.culture-section > *', '.values-section article',
      '.contact-page__intro > *', '.contact-form', '.related-entry > *',
    ].join(',')
    const elements = [...document.querySelectorAll(selector)]
    let previousY = window.scrollY

    elements.forEach((element, index) => {
      element.classList.add('scroll-reveal')
      element.dataset.revealOrigin = 'down'
      element.style.setProperty('--reveal-delay', `${(index % 4) * 45}ms`)
      const bounds = element.getBoundingClientRect()
      if (bounds.top < window.innerHeight * .92 && bounds.bottom > 0) element.classList.add('is-revealed')
    })

    const observer = new IntersectionObserver(entries => {
      const currentY = window.scrollY
      const direction = currentY >= previousY ? 'down' : 'up'
      previousY = currentY
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.dataset.revealOrigin = direction
          requestAnimationFrame(() => entry.target.classList.add('is-revealed'))
        } else {
          entry.target.classList.remove('is-revealed')
          entry.target.dataset.revealOrigin = direction === 'down' ? 'up' : 'down'
        }
      })
    }, { rootMargin: '-7% 0px -7% 0px', threshold: .08 })

    elements.forEach(element => observer.observe(element))
    return () => observer.disconnect()
  }, [location.pathname])

  return null
}

export default function SiteLayout() {
  const location = useLocation()

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      if (location.hash) document.querySelector(location.hash)?.scrollIntoView({ behavior: 'smooth' })
      else window.scrollTo({ top: 0, behavior: 'auto' })
    })
    return () => cancelAnimationFrame(frame)
  }, [location.hash, location.pathname])

  return <>
    <ScrollProgress />
    <Header />
    <AnimatePresence mode="wait" initial={false}>
      <motion.main className="page-transition" key={`${location.pathname}${location.hash}`} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: .34, ease: [.2, 0, 0, 1] }}>
        <motion.div className="void-flow-transition" initial={{ scaleX: 0, opacity: 1 }} animate={{ scaleX: [0, 1, 1], opacity: [1, 1, 0] }} transition={{ duration: .52, times: [0, .72, 1], ease: [.2, 0, 0, 1] }} aria-hidden="true" />
        <Outlet />
        <ScrollReveal />
      </motion.main>
    </AnimatePresence>
    <Footer />
  </>
}

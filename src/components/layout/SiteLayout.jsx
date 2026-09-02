import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { animate, createScope, onScroll } from 'animejs'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { navigation } from '../../content/siteContent'
import { ArrowIcon, MenuIcon } from '../Icons'

export function Logo() {
  return <Link className="logo" to="/" aria-label="VoidCube — início">
    <svg className="logo-symbol" viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <path d="m16 3 10 6v12l-10 6-10-6V9l10-6Z" stroke="currentColor" />
      <path d="m6 9 10 6 10-6M16 15v12" stroke="currentColor" opacity=".6" />
      <path d="m16 3 4.8 2.9L11 12 6 9l10-6Z" fill="currentColor" opacity=".18" />
      <circle cx="16" cy="15" r="2" fill="#79b7e8" />
    </svg>
    <span>VOID<b>CUBE</b></span>
  </Link>
}

function Header() {
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

function Footer() {
  return <footer className="site-footer">
    <div className="footer-heading">
      <div className="footer-heading__brand">
        <Logo />
        <span>Engenharia de software<br />no Pará</span>
      </div>
      <div className="footer-heading__message">
        <span className="footer-kicker">Perto da operação · presente depois da entrega</span>
        <h2>Software criado <em>perto de quem usa.</em></h2>
        <div className="footer-heading__action">
          <p>Começamos pelo processo real e seguimos responsáveis pelo que precisa continuar funcionando.</p>
          <div className="footer-heading__links">
            <nav aria-label="Navegação do rodapé"><Link to="/#solucoes">Soluções</Link><Link to="/sobre">Sobre</Link><Link to="/blog">VOID/LOG</Link></nav>
            <Link className="footer-cta" to="/contato">Conversar com engenharia <ArrowIcon size={20} /></Link>
          </div>
        </div>
      </div>
    </div>
    <div className="footer-territory" role="img" aria-label="VoidCube, de Belém a Ananindeua, Pará">
      <span><i aria-hidden="true" />Belém</span>
      <b aria-hidden="true"><i /></b>
      <span><i aria-hidden="true" />Ananindeua</span>
      <small>Pará · Brasil</small>
    </div>
    <div className="footer-bottom"><span>© 2026 VoidCube</span><p>O contato abre no WhatsApp; este site não armazena os dados do formulário.</p><span>Feito no Pará</span></div>
  </footer>
}

function ScrollProgress() {
  const ref = useRef(null)
  useEffect(() => {
    let frame = 0
    const update = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const distance = document.documentElement.scrollHeight - window.innerHeight
        ref.current?.style.setProperty('--progress', distance > 0 ? window.scrollY / distance : 0)
      })
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => { cancelAnimationFrame(frame); window.removeEventListener('scroll', update); window.removeEventListener('resize', update) }
  }, [])
  return <div ref={ref} className="scroll-progress" aria-hidden="true" />
}

function snapshotStyle(element, property) {
  return {
    value: element.style.getPropertyValue(property),
    priority: element.style.getPropertyPriority(property),
  }
}

function restoreStyle(element, property, snapshot) {
  if (snapshot.value) element.style.setProperty(property, snapshot.value, snapshot.priority)
  else element.style.removeProperty(property)
}

function ScrollReveal({ mainRef, animateRouteEntry }) {
  useLayoutEffect(() => {
    const main = mainRef.current
    if (!main) return undefined

    let routeEntryPending = animateRouteEntry
    const motionScope = createScope({
      root: main,
      mediaQueries: { reducedMotion: '(prefers-reduced-motion: reduce)' },
    })

    motionScope.add(currentScope => {
      const reducedMotion = currentScope.matches.reducedMotion
      const prepared = new Map()
      const scrollObservers = new Map()
      const activeAnimations = new Map()
      const mainAnimationStyle = snapshotStyle(main, 'animation')
      const mainOpacityStyle = snapshotStyle(main, 'opacity')

      main.style.setProperty('animation', 'none')
      if (routeEntryPending && !reducedMotion) {
        animate(main, {
          opacity: [0, 1],
          duration: 480,
          ease: 'outCubic',
        })
      } else {
        main.style.setProperty('opacity', '1')
      }
      routeEntryPending = false

      const stopActiveAnimation = element => {
        const active = activeAnimations.get(element)
        if (!active) return
        active.cancel()
        activeAnimations.delete(element)
      }

      const settleWillChange = element => {
        const state = prepared.get(element)
        if (state) restoreStyle(element, 'will-change', state.willChange)
      }

      const reveal = (element, offset) => currentScope.execute(() => {
        stopActiveAnimation(element)
        const currentOpacity = Number.parseFloat(getComputedStyle(element).opacity)
        if (!Number.isFinite(currentOpacity) || currentOpacity <= .05) {
          element.style.setProperty('opacity', '0')
          element.style.setProperty('transform', `translateY(${offset}px)`)
        }
        element.classList.add('is-visible')
        element.style.setProperty('will-change', 'opacity, transform')

        let entrance
        entrance = animate(element, {
          opacity: 1,
          translateY: 0,
          duration: 560,
          ease: 'outExpo',
          onComplete: () => {
            if (activeAnimations.get(element) === entrance) activeAnimations.delete(element)
            settleWillChange(element)
          },
        })
        activeAnimations.set(element, entrance)
      })

      const conceal = (element, offset) => currentScope.execute(() => {
        stopActiveAnimation(element)
        element.classList.add('is-visible')
        element.style.setProperty('will-change', 'opacity, transform')

        let exit
        exit = animate(element, {
          opacity: 0,
          translateY: offset,
          duration: 240,
          ease: 'inCubic',
          onComplete: () => {
            if (activeAnimations.get(element) === exit) activeAnimations.delete(element)
            element.classList.remove('is-visible')
            settleWillChange(element)
          },
        })
        activeAnimations.set(element, exit)
      })

      const registerReveal = element => {
        if (prepared.has(element)) return

        const state = {
          hadReadyAttribute: element.hasAttribute('data-reveal-ready'),
          hadVisibleClass: element.classList.contains('is-visible'),
          opacity: snapshotStyle(element, 'opacity'),
          transform: snapshotStyle(element, 'transform'),
          willChange: snapshotStyle(element, 'will-change'),
        }
        prepared.set(element, state)
        element.removeAttribute('data-reveal-ready')

        if (reducedMotion) {
          element.classList.add('is-visible')
          return
        }

        element.classList.remove('is-visible')
        element.style.setProperty('opacity', '0')
        element.style.setProperty('transform', 'translateY(24px)')

        const scrollObserver = onScroll({
          target: element,
          enter: 'end-=7% start',
          leave: 'start+=3% end',
          repeat: true,
          onEnterForward: () => reveal(element, 24),
          onLeaveForward: () => conceal(element, -18),
          onEnterBackward: () => reveal(element, -24),
          onLeaveBackward: () => conceal(element, 18),
        })
        scrollObservers.set(element, scrollObserver)
      }

      const unregisterReveal = element => {
        const state = prepared.get(element)
        if (!state) return

        stopActiveAnimation(element)
        scrollObservers.get(element)?.revert()
        scrollObservers.delete(element)
        if (state.hadReadyAttribute) element.setAttribute('data-reveal-ready', '')
        else element.removeAttribute('data-reveal-ready')
        element.classList.toggle('is-visible', state.hadVisibleClass)
        restoreStyle(element, 'opacity', state.opacity)
        restoreStyle(element, 'transform', state.transform)
        restoreStyle(element, 'will-change', state.willChange)
        prepared.delete(element)
      }

      const visitRevealElements = (root, visitor) => {
        if (root.nodeType !== 1) return
        if (root.matches?.('[data-reveal]')) visitor(root)
        root.querySelectorAll?.('[data-reveal]').forEach(visitor)
      }

      visitRevealElements(main, registerReveal)
      const mutations = new MutationObserver(records => {
        currentScope.execute(() => {
          records.forEach(record => {
            record.removedNodes.forEach(node => visitRevealElements(node, unregisterReveal))
            record.addedNodes.forEach(node => visitRevealElements(node, registerReveal))
          })
        })
      })
      mutations.observe(main, { childList: true, subtree: true })

      return () => {
        mutations.disconnect()
        Array.from(prepared.keys()).forEach(unregisterReveal)
        restoreStyle(main, 'animation', mainAnimationStyle)
        restoreStyle(main, 'opacity', mainOpacityStyle)
      }
    })

    return () => motionScope.revert()
  }, [animateRouteEntry, mainRef])

  return null
}

export default function SiteLayout() {
  const location = useLocation()
  const mainRef = useRef(null)
  const routeMotionPathname = useRef(null)
  const focusPathname = useRef(location.pathname)
  const animateRouteEntry = useMemo(
    () => routeMotionPathname.current !== location.pathname,
    [location.hash, location.pathname],
  )

  useLayoutEffect(() => {
    routeMotionPathname.current = location.pathname
  }, [location.pathname])

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      const behavior = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'
      if (location.hash) document.querySelector(location.hash)?.scrollIntoView({ behavior })
      else window.scrollTo({ top: 0, behavior: 'auto' })
    })
    return () => cancelAnimationFrame(frame)
  }, [location.hash, location.pathname])

  useEffect(() => {
    const pathnameChanged = focusPathname.current !== location.pathname
    focusPathname.current = location.pathname
    if (!pathnameChanged || location.hash) return undefined

    const main = mainRef.current
    if (!main) return undefined
    let frame = 0
    let focusedHeading = null
    let previousTabIndex = null
    let hadTabIndex = false

    const restoreTabIndex = () => {
      if (!focusedHeading) return
      focusedHeading.removeEventListener('blur', restoreTabIndex)
      if (hadTabIndex) focusedHeading.setAttribute('tabindex', previousTabIndex)
      else focusedHeading.removeAttribute('tabindex')
      focusedHeading = null
    }
    const focusHeading = () => {
      if (focusedHeading) return true
      const heading = main.querySelector('h1')
      if (!heading) return false
      focusedHeading = heading
      hadTabIndex = heading.hasAttribute('tabindex')
      previousTabIndex = heading.getAttribute('tabindex')
      heading.setAttribute('tabindex', '-1')
      heading.focus({ preventScroll: true })
      if (document.activeElement === heading) heading.addEventListener('blur', restoreTabIndex, { once: true })
      else restoreTabIndex()
      return true
    }

    const mutations = new MutationObserver(() => {
      if (focusHeading()) {
        cancelAnimationFrame(frame)
        frame = 0
        mutations.disconnect()
      }
    })
    mutations.observe(main, { childList: true, subtree: true })
    frame = requestAnimationFrame(() => {
      frame = 0
      if (focusHeading()) mutations.disconnect()
    })

    return () => {
      cancelAnimationFrame(frame)
      mutations.disconnect()
      restoreTabIndex()
    }
  }, [location.hash, location.pathname])

  return <>
    <a className="skip-link" href="#main-content">Pular para o conteúdo</a>
    <ScrollProgress />
    <Header />
    <main ref={mainRef} id="main-content" className="page-main" key={`${location.pathname}${location.hash}`}><Outlet /><ScrollReveal mainRef={mainRef} animateRouteEntry={animateRouteEntry} /></main>
    <Footer />
  </>
}

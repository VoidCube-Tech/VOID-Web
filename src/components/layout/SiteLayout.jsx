import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { animate, createScope } from 'animejs'
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

  const headerClassName = ['site-header', scrolled && 'is-scrolled', open && 'is-menu-open'].filter(Boolean).join(' ')

  return <header className={headerClassName}>
    <Logo />
    <nav ref={navRef} id="main-navigation" className={open ? 'site-nav is-open' : 'site-nav'} aria-label="Navegação principal">
      {navigation.map(item => <Link key={item.href} to={item.href} onClick={() => setOpen(false)} aria-current={isCurrent(item.href) ? 'page' : undefined}>{item.label}</Link>)}
      <Link className="header-cta" to="/contato" onClick={() => setOpen(false)} aria-current={location.pathname === '/contato' ? 'page' : undefined}>Iniciar projeto <ArrowIcon size={15} /></Link>
    </nav>
    <button ref={menuButtonRef} className="menu-button" type="button" onClick={() => setOpen(value => !value)} aria-expanded={open} aria-controls="main-navigation" aria-label={open ? 'Fechar menu' : 'Abrir menu'}><MenuIcon open={open} /></button>
  </header>
}

function Footer({ footerRef }) {
  return <footer ref={footerRef} className="site-footer">
    <div className="footer-heading">
      <div className="footer-heading__brand" data-reveal>
        <Logo />
        <span>Engenharia de software<br />no Pará</span>
      </div>
      <div className="footer-heading__message">
        <span className="footer-kicker" data-reveal>Perto da operação · presente depois da entrega</span>
        <h2>Software criado <em>perto de quem usa.</em></h2>
        <div className="footer-heading__action">
          <p>Começamos pelo processo real e seguimos responsáveis pelo que precisa continuar funcionando.</p>
          <div className="footer-heading__links">
            <nav aria-label="Navegação do rodapé" data-reveal><Link to="/#solucoes">Soluções</Link><Link to="/sobre">Sobre</Link><Link to="/blog">VOID/LOG</Link></nav>
            <Link className="footer-cta" to="/contato" data-reveal>Conversar com engenharia <ArrowIcon size={20} /></Link>
          </div>
        </div>
      </div>
    </div>
    <div className="footer-territory" role="img" aria-label="VoidCube, de Belém a Ananindeua, Pará" data-reveal>
      <span><i aria-hidden="true" />Belém</span>
      <b aria-hidden="true"><i /></b>
      <span><i aria-hidden="true" />Ananindeua</span>
      <small>Pará · Brasil</small>
    </div>
    <div className="footer-bottom" data-reveal><span>© 2026 VoidCube</span><p>O contato abre no WhatsApp; este site não armazena os dados do formulário.</p><span>Feito no Pará</span></div>
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

const revealSelector = '[data-reveal], [data-reveal-item], h1, h2, h3, h4, h5, h6, p, blockquote, .section-index, .button, .text-link'
// Sticky story panels already have a reversible, scroll-driven choreography.
const managedMotionSelector = '[data-reveal="off"], [data-hero-beat], [data-solution-beat], [aria-hidden="true"], [role="status"], [role="alert"], .contact-error'

function ScrollReveal({ mainRef, footerRef, animateRouteEntry }) {
  useLayoutEffect(() => {
    const main = mainRef.current
    if (!main) return undefined
    const roots = [main, footerRef.current].filter(Boolean)

    let routeEntryPending = animateRouteEntry
    const motionScope = createScope({
      root: main.parentElement,
      mediaQueries: { reducedMotion: '(prefers-reduced-motion: reduce)' },
    })

    motionScope.add(currentScope => {
      const reducedMotion = currentScope.matches.reducedMotion
      const prepared = new Map()
      const activeAnimations = new Map()
      let previousScrollY = window.scrollY
      let direction = 1
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
        state?.targets.forEach(targetState => restoreStyle(targetState.element, 'will-change', targetState.willChange))
      }

      const reveal = (element, offset) => currentScope.execute(() => {
        stopActiveAnimation(element)
        const state = prepared.get(element)
        if (!state) return
        const targets = state.targets.map(targetState => targetState.element)
        targets.forEach(target => {
          const currentOpacity = Number.parseFloat(getComputedStyle(target).opacity)
          if (!Number.isFinite(currentOpacity) || currentOpacity <= .05) {
            target.style.setProperty('opacity', '0')
            target.style.setProperty('transform', `translateY(${offset}px)`)
          }
          target.classList.add('is-visible')
          target.style.setProperty('will-change', 'opacity, transform')
        })

        let entrance
        entrance = animate(targets, {
          opacity: 1,
          translateY: 0,
          delay: state.delay,
          duration: 560,
          ease: 'outExpo',
          onComplete: () => {
            if (activeAnimations.get(element) === entrance) activeAnimations.delete(element)
            state.targets.forEach(targetState => restoreStyle(targetState.element, 'transform', targetState.transform))
            settleWillChange(element)
          },
        })
        activeAnimations.set(element, entrance)
      })

      const conceal = (element, offset) => currentScope.execute(() => {
        // A focused form control or link must remain visible during keyboard use.
        if (document.activeElement?.matches('a, button, input, textarea, select, [contenteditable="true"]') && element.contains(document.activeElement)) return
        stopActiveAnimation(element)
        const state = prepared.get(element)
        if (!state) return
        const targets = state.targets.map(targetState => targetState.element)
        targets.forEach(target => {
          target.classList.add('is-visible')
          target.style.setProperty('will-change', 'opacity, transform')
        })

        let exit
        exit = animate(targets, {
          opacity: 0,
          translateY: offset,
          duration: 240,
          ease: 'inCubic',
          onComplete: () => {
            if (activeAnimations.get(element) === exit) activeAnimations.delete(element)
            targets.forEach(target => target.classList.remove('is-visible'))
            settleWillChange(element)
          },
        })
        activeAnimations.set(element, exit)
      })

      const updateDirection = () => {
        const scrollY = window.scrollY
        if (scrollY !== previousScrollY) direction = scrollY > previousScrollY ? 1 : -1
        previousScrollY = scrollY
      }
      // Actual intersections also handle sticky asides, font loading and filtered lists.
      const observer = !reducedMotion && 'IntersectionObserver' in window
        ? new IntersectionObserver(entries => {
          entries.forEach(entry => {
            if (entry.isIntersecting) reveal(entry.target, direction * 24)
            else if (entry.target.classList.contains('is-visible')) {
              conceal(entry.target, entry.boundingClientRect.bottom <= entry.rootBounds.top ? -18 : 18)
            }
          })
        }, { rootMargin: '-24px 0px 0px 0px', threshold: 0 })
        : null

      const registerReveal = element => {
        if (prepared.has(element) || element.closest(managedMotionSelector)) return
        // Animate one content block only; never fade both it and its descendants.
        if (element.parentElement?.closest(revealSelector)) return

        // Observe each list item independently, including lists taller than a screen.
        const targets = [element]
        const group = element.closest('[data-reveal-group]')
        const siblings = group ? [...group.querySelectorAll('[data-reveal-item]')] : []
        const state = {
          delay: Math.min(Math.max(0, siblings.indexOf(element)) * 55, 165),
          targets: targets.map(target => ({
            element: target,
            hadReadyAttribute: target.hasAttribute('data-reveal-ready'),
            hadVisibleClass: target.classList.contains('is-visible'),
            opacity: snapshotStyle(target, 'opacity'),
            transform: snapshotStyle(target, 'transform'),
            willChange: snapshotStyle(target, 'will-change'),
          })),
        }
        prepared.set(element, state)
        targets.forEach(target => target.setAttribute('data-reveal-ready', ''))

        if (!observer) {
          targets.forEach(target => target.classList.add('is-visible'))
          return
        }

        targets.forEach(target => {
          target.classList.remove('is-visible')
          target.style.setProperty('opacity', '0')
          target.style.setProperty('transform', 'translateY(24px)')
        })

        observer.observe(element)
      }

      const unregisterReveal = element => {
        const state = prepared.get(element)
        if (!state) return

        stopActiveAnimation(element)
        observer?.unobserve(element)
        state.targets.forEach(targetState => {
          const target = targetState.element
          if (targetState.hadReadyAttribute) target.setAttribute('data-reveal-ready', '')
          else target.removeAttribute('data-reveal-ready')
          target.classList.toggle('is-visible', targetState.hadVisibleClass)
          restoreStyle(target, 'opacity', targetState.opacity)
          restoreStyle(target, 'transform', targetState.transform)
          restoreStyle(target, 'will-change', targetState.willChange)
        })
        prepared.delete(element)
      }

      const visitRevealElements = (root, visitor) => {
        if (root.nodeType !== 1) return
        if (root.matches?.(revealSelector)) visitor(root)
        root.querySelectorAll?.(revealSelector).forEach(visitor)
      }

      const revealFocusedBlock = event => {
        for (const element of prepared.keys()) {
          if (!element.contains(event.target)) continue
          stopActiveAnimation(element)
          const state = prepared.get(element)
          element.style.setProperty('opacity', '1')
          element.classList.add('is-visible')
          restoreStyle(element, 'transform', state.targets[0].transform)
          settleWillChange(element)
        }
      }

      roots.forEach(root => visitRevealElements(root, registerReveal))
      const mutations = new MutationObserver(records => {
        // Ignore text scrambling and counters; only DOM structure changes targets.
        const changed = records.filter(record => [...record.addedNodes, ...record.removedNodes].some(node => node.nodeType === 1))
        if (!changed.length) return
        currentScope.execute(() => {
          changed.forEach(record => {
            record.removedNodes.forEach(node => visitRevealElements(node, unregisterReveal))
            record.addedNodes.forEach(node => visitRevealElements(node, registerReveal))
          })
        })
      })
      roots.forEach(root => {
        mutations.observe(root, { childList: true, subtree: true })
        root.addEventListener('focusin', revealFocusedBlock)
      })
      if (observer) window.addEventListener('scroll', updateDirection, { passive: true })

      return () => {
        mutations.disconnect()
        observer?.disconnect()
        window.removeEventListener('scroll', updateDirection)
        roots.forEach(root => root.removeEventListener('focusin', revealFocusedBlock))
        Array.from(prepared.keys()).forEach(unregisterReveal)
        restoreStyle(main, 'animation', mainAnimationStyle)
        restoreStyle(main, 'opacity', mainOpacityStyle)
      }
    })

    return () => motionScope.revert()
  }, [animateRouteEntry, mainRef, footerRef])

  return null
}

export default function SiteLayout() {
  const location = useLocation()
  const mainRef = useRef(null)
  const footerRef = useRef(null)
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
    <main ref={mainRef} id="main-content" className="page-main" key={`${location.pathname}${location.hash}`}><Outlet /></main>
    <Footer footerRef={footerRef} />
    <ScrollReveal key={`reveal:${location.pathname}${location.hash}`} mainRef={mainRef} footerRef={footerRef} animateRouteEntry={animateRouteEntry} />
  </>
}

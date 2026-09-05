import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ArrowIcon, MenuIcon } from './Icons'
import { Logo } from './Logo'
import { Link, useLocation } from 'react-router-dom'
import '../style/header.css'

export function Header() {
  const { t } = useTranslation('navigation')
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const navRef = useRef(null)
  const menuButtonRef = useRef(null)
  const location = useLocation()

  const navigation = t('items', { returnObjects: true })

  useEffect(() => setOpen(false), [location.pathname, location.hash])

  useEffect(() => {
    let frame = 0

    const onScroll = () => {
      cancelAnimationFrame(frame)

      frame = requestAnimationFrame(() => {
        setScrolled(window.scrollY > 18)
      })
    }

    onScroll()

    window.addEventListener('scroll', onScroll, { passive: true })

    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  useEffect(() => {
    document.documentElement.classList.toggle('menu-open', open)

    if (!open) {
      return () => document.documentElement.classList.remove('menu-open')
    }

    const nav = navRef.current
    const button = menuButtonRef.current

    const outside = [
      document.getElementById('main-content'),
      document.querySelector('.site-footer'),
    ]
      .filter(Boolean)
      .map(element => ({ element, inert: element.inert }))

    outside.forEach(({ element }) => {
      element.inert = true
    })

    const frame = requestAnimationFrame(() => {
      nav?.querySelector('a[href]')?.focus({ preventScroll: true })
    })

    const handleKeyDown = event => {
      if (event.key === 'Escape') {
        event.preventDefault()
        setOpen(false)
        return
      }

      if (event.key !== 'Tab' || !nav || !button) return

      const controls = [
        ...nav.querySelectorAll('a[href]'),
        button,
      ].filter(element => !element.hasAttribute('disabled'))

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

      outside.forEach(({ element, inert }) => {
        element.inert = inert
      })

      document.documentElement.classList.remove('menu-open')
      window.removeEventListener('keydown', handleKeyDown)
      button?.focus({ preventScroll: true })
    }
  }, [open])

  const isCurrent = path => {
    return path === '/'
      ? location.pathname === '/'
      : location.pathname.startsWith(path)
  }

  return (
    <header className={scrolled ? 'site-header is-scrolled' : 'site-header'}>
      <Logo />

      <nav
        ref={navRef}
        id="main-navigation"
        className={open ? 'site-nav is-open' : 'site-nav'}
        aria-label={t('ariaLabel')}
      >
        {navigation.map(item => (
          <Link
            key={item.path}
            to={item.path}
            aria-current={isCurrent(item.path) ? 'page' : undefined}
          >
            {t(item.label)}
          </Link>
        ))}

        <Link
          className="header-cta"
          to="/contato"
          aria-current={
            location.pathname === '/contato' ? 'page' : undefined
          }
        >
          {t('cta')}
          <ArrowIcon size={15} />
        </Link>
      </nav>

      <button
        ref={menuButtonRef}
        className="menu-button"
        type="button"
        onClick={() => setOpen(value => !value)}
        aria-expanded={open}
        aria-controls="main-navigation"
        aria-label={open ? t('closeMenu') : t('openMenu')}
      >
        <MenuIcon open={open} />
      </button>
    </header>
  )
}

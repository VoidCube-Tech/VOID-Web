import { useEffect, useMemo, useRef } from 'react'
import { gsap } from 'gsap'
import './FoldText.css'

const HINGES = {
  top: { origin: '50% 0%', rotateX: -92, rotateY: 0 },
  bottom: { origin: '50% 100%', rotateX: 92, rotateY: 0 },
  left: { origin: '0% 50%', rotateX: 0, rotateY: 92 },
  right: { origin: '100% 50%', rotateX: 0, rotateY: -92 },
}

export default function FoldText({ text, splitBy = 'word', hinge = 'top', duration = 0.65, stagger = 0.045, delay = 0, ease = 'power3.out', perspective = 700, creaseShading = 0.55, foldAmount = 1, lift = 0, className = '' }) {
  const rootRef = useRef(null)
  const config = HINGES[hinge] || HINGES.top
  const crease = Math.min(1, Math.max(0, creaseShading))
  const segments = useMemo(() => {
    const parts = splitBy === 'line' ? [text] : splitBy === 'char' ? Array.from(text) : text.split(/(\s+)/)
    return parts.map((part, index) => /^\s+$/.test(part)
      ? <span className="fold-text-whitespace" key={`space-${index}`}>{part.replace(/ /g, '\u00a0')}</span>
      : <span className="fold-text-segment" key={`${part}-${index}`} style={{ '--fold-perspective': `${Math.max(120, perspective)}px` }}><span className="fold-text-piece" data-fold-hinge={hinge} style={{ transformOrigin: config.origin, '--fold-crease': 0 }}>{part || '\u00a0'}</span></span>)
  }, [config.origin, hinge, perspective, splitBy, text])

  useEffect(() => {
    const pieces = Array.from(rootRef.current?.querySelectorAll('.fold-text-piece') || [])
    const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    const tween = gsap.fromTo(pieces, { opacity: 0, y: reduceMotion ? 0 : lift, rotateX: reduceMotion ? 0 : config.rotateX * foldAmount, rotateY: reduceMotion ? 0 : config.rotateY * foldAmount, '--fold-crease': reduceMotion ? 0 : crease * foldAmount, transformOrigin: config.origin, force3D: true }, { opacity: 1, y: 0, rotateX: 0, rotateY: 0, '--fold-crease': 0, duration: reduceMotion ? 0.01 : duration, stagger: reduceMotion ? 0 : stagger, delay: reduceMotion ? 0 : delay, ease: reduceMotion ? 'none' : ease, clearProps: 'willChange' })
    return () => tween.kill()
  }, [config, crease, delay, duration, ease, foldAmount, lift, stagger, text])

  return <span ref={rootRef} className={`fold-text ${className}`.trim()}><span className="fold-text-sr-only">{text}</span><span className="fold-text-visual" aria-hidden="true">{segments}</span></span>
}

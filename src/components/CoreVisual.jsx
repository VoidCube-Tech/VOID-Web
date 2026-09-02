import React, { useEffect, useId, useRef } from 'react'
import blackHoleBase from '../assets/black-hole-base.svg'

const stars = [
  [82, 242, 1.2], [121, 126, 1.8], [184, 82, 1], [286, 116, 1.3],
  [438, 78, 1.1], [548, 132, 1.7], [632, 252, 1.1], [590, 414, 1.4],
  [648, 488, 1], [522, 592, 1.6], [382, 640, 1.1], [226, 608, 1.4],
  [112, 514, 1.1], [70, 388, 1.5], [486, 204, .9], [202, 428, .9],
]

function RotatingCube() {
  return <div className="core-cube-stage" aria-hidden="true">
    <div className="core-cube">
      <span className="core-cube__face core-cube__face--front"><i>VC</i></span>
      <span className="core-cube__face core-cube__face--back"><i>01</i></span>
      <span className="core-cube__face core-cube__face--right"><i /></span>
      <span className="core-cube__face core-cube__face--left"><i /></span>
      <span className="core-cube__face core-cube__face--top"><i /></span>
      <span className="core-cube__face core-cube__face--bottom"><i /></span>
    </div>
  </div>
}

export default function CoreVisual({ mode = 'idle', compact = false }) {
  const rootRef = useRef(null)
  const rawId = useId()
  const id = rawId.replace(/:/g, '')

  useEffect(() => {
    const root = rootRef.current
    if (!root || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined

    const visibilityObserver = new IntersectionObserver(([entry]) => {
      root.classList.toggle('is-in-view', entry.isIntersecting)
    }, { rootMargin: '12% 0px', threshold: 0.05 })
    visibilityObserver.observe(root)

    let frame = 0
    let previous = 0
    let currentX = 0
    let currentY = 0
    let targetX = 0
    let targetY = 0

    const paint = now => {
      const elapsed = previous ? Math.min(34, now - previous) : 16
      const response = 1 - Math.exp(-elapsed * .01)
      previous = now
      currentX += (targetX - currentX) * response
      currentY += (targetY - currentY) * response

      root.style.setProperty('--field-x', `${currentX * 5}px`)
      root.style.setProperty('--field-y', `${currentY * 3.5}px`)
      root.style.setProperty('--cube-x', `${currentX * 12}px`)
      root.style.setProperty('--cube-y', `${currentY * 8}px`)
      root.style.setProperty('--scene-rx', `${currentY * -2.2}deg`)
      root.style.setProperty('--scene-ry', `${currentX * 3}deg`)

      if (Math.abs(targetX - currentX) + Math.abs(targetY - currentY) > .003) {
        frame = requestAnimationFrame(paint)
      } else {
        frame = 0
        previous = 0
      }
    }

    const start = () => {
      if (!frame) frame = requestAnimationFrame(paint)
    }

    const update = event => {
      const bounds = root.getBoundingClientRect()
      targetX = Math.max(-1, Math.min(1, ((event.clientX - bounds.left) / bounds.width) * 2 - 1))
      targetY = Math.max(-1, Math.min(1, ((event.clientY - bounds.top) / bounds.height) * 2 - 1))
      start()
    }

    const reset = () => {
      targetX = 0
      targetY = 0
      start()
    }

    root.addEventListener('pointermove', update, { passive: true })
    root.addEventListener('pointerleave', reset)
    return () => {
      cancelAnimationFrame(frame)
      visibilityObserver.disconnect()
      root.removeEventListener('pointermove', update)
      root.removeEventListener('pointerleave', reset)
    }
  }, [])

  return <div
    ref={rootRef}
    className={compact ? 'core-vector is-compact' : 'core-vector'}
    data-mode={mode}
    role="img"
    aria-label="Cubo tridimensional azul e branco da VoidCube girando dentro do horizonte de eventos"
  >
    <svg className="core-vector__space" viewBox="0 0 720 720" aria-hidden="true">
      <defs>
        <radialGradient id={`${id}-halo`} cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="#1478d4" stopOpacity=".16" />
          <stop offset=".38" stopColor="#79b7e8" stopOpacity=".12" />
          <stop offset="1" stopColor="#040a16" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${id}-disk`} x1="74" y1="388" x2="648" y2="326" gradientUnits="userSpaceOnUse">
          <stop stopColor="#79b7e8" stopOpacity=".05" />
          <stop offset=".26" stopColor="#79b7e8" stopOpacity=".8" />
          <stop offset=".49" stopColor="#f4f8ff" />
          <stop offset=".67" stopColor="#1478d4" />
          <stop offset="1" stopColor="#1478d4" stopOpacity=".04" />
        </linearGradient>
        <linearGradient id={`${id}-lens`} x1="236" y1="176" x2="496" y2="528" gradientUnits="userSpaceOnUse">
          <stop stopColor="#79b7e8" stopOpacity=".08" />
          <stop offset=".42" stopColor="#f4f8ff" stopOpacity=".72" />
          <stop offset=".62" stopColor="#79b7e8" stopOpacity=".82" />
          <stop offset="1" stopColor="#1478d4" stopOpacity=".03" />
        </linearGradient>
        <filter id={`${id}-soft`} x="-50%" y="-80%" width="200%" height="260%">
          <feGaussianBlur stdDeviation="5" />
        </filter>
        <filter id={`${id}-tight`} x="-50%" y="-80%" width="200%" height="260%">
          <feGaussianBlur stdDeviation="1.8" />
        </filter>
      </defs>

      <circle className="core-vector__halo" cx="360" cy="360" r="318" fill={`url(#${id}-halo)`} />
      <g className="core-vector__field">
        <g className="core-vector__stars">
          {stars.map(([cx, cy, r]) => <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={r} />)}
        </g>

        <g className="core-vector__repo-field" transform="translate(360 360) rotate(-13) scale(1 .37) translate(-360 -360)">
          <image href={blackHoleBase} x="78" y="78" width="564" height="564" />
        </g>

        <g className="core-vector__disk core-vector__disk--rear" fill="none">
          <ellipse cx="360" cy="360" rx="287" ry="86" transform="rotate(-13 360 360)" />
          <ellipse cx="360" cy="360" rx="248" ry="67" transform="rotate(-13 360 360)" />
          <ellipse className="core-vector__stream core-vector__stream--outer" cx="360" cy="360" rx="276" ry="81" transform="rotate(-13 360 360)" pathLength="1" />
          <ellipse className="core-vector__stream core-vector__stream--inner" cx="360" cy="360" rx="232" ry="61" transform="rotate(-13 360 360)" pathLength="1" />
          <path className="core-vector__lensing core-vector__lensing--upper" d="M218 328c20-143 247-174 298-44" stroke={`url(#${id}-lens)`} />
          <path className="core-vector__lensing core-vector__lensing--lower" d="M239 409c61 103 216 107 262 11" stroke={`url(#${id}-lens)`} />
        </g>

        <ellipse className="core-vector__event-glow" cx="360" cy="360" rx="151" ry="98" transform="rotate(-13 360 360)" fill="none" stroke={`url(#${id}-disk)`} filter={`url(#${id}-soft)`} />
        <ellipse className="core-vector__event-rim" cx="360" cy="360" rx="137" ry="86" transform="rotate(-13 360 360)" fill="#07162b" stroke={`url(#${id}-disk)`} />
        <ellipse className="core-vector__event-core" cx="360" cy="360" rx="112" ry="72" transform="rotate(-13 360 360)" fill="#040a16" />
      </g>
    </svg>

    <RotatingCube />

    <svg className="core-vector__foreground" viewBox="0 0 720 720" aria-hidden="true">
      <defs>
        <linearGradient id={`${id}-front`} x1="74" y1="404" x2="650" y2="322" gradientUnits="userSpaceOnUse">
          <stop stopColor="#79b7e8" stopOpacity=".04" />
          <stop offset=".3" stopColor="#79b7e8" stopOpacity=".82" />
          <stop offset=".5" stopColor="#f4f8ff" />
          <stop offset=".7" stopColor="#1478d4" stopOpacity=".9" />
          <stop offset="1" stopColor="#1478d4" stopOpacity=".04" />
        </linearGradient>
      </defs>
      <g className="core-vector__front-field">
        <path d="M76 418C202 414 244 387 340 367c114-24 205-6 306-54" fill="none" stroke={`url(#${id}-front)`} strokeWidth="4" strokeLinecap="round" />
      </g>
    </svg>
  </div>
}

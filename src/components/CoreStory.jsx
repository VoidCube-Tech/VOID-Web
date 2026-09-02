import React, { Suspense, lazy, useEffect, useRef, useState } from 'react'
import { animate, createScope, onScroll } from 'animejs'
import { Link } from 'react-router-dom'
import { ArrowIcon, CapabilityIcon } from './Icons'

const BlackHole3D = lazy(() => import('./BlackHole3D'))

function HeroModelFallback() {
  return <div
    className="hero-model-fallback"
    role="img"
    aria-label="Cubo tridimensional VoidCube sobre um campo gravitacional azul"
  >
    <span className="hero-model-fallback__core" aria-hidden="true" />
  </div>
}

class VisualErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { failed: false }
  }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  componentDidCatch(error) {
    console.warn('A cena 3D não carregou; usando o estado visual estático.', error)
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children
  }
}

function ThreeDimensionalCore({ className = '' }) {
  return <VisualErrorBoundary fallback={<HeroModelFallback />}>
    <Suspense fallback={<HeroModelFallback />}>
      <BlackHole3D className={className} />
    </Suspense>
  </VisualErrorBoundary>
}

const capabilities = [
  {
    mode: 'system',
    code: 'SYS / 01',
    title: 'Sistemas sob medida',
    text: 'ERPs, portais e plataformas que seguem o fluxo real da empresa — inclusive quando o processo sai do caminho feliz.',
    detail: 'Arquitetura web · APIs · aplicações internas',
    signal: 'um núcleo operacional',
  },
  {
    mode: 'automate',
    code: 'AUT / 02',
    title: 'Automação de processos',
    text: 'Fluxos que conciliam dados, executam o trabalho repetitivo e encaminham cada exceção para a pessoa certa.',
    detail: 'Financeiro · operações · atendimento',
    signal: 'orquestração contínua',
  },
  {
    mode: 'connect',
    code: 'INT / 03',
    title: 'Integrações confiáveis',
    text: 'ERP, CRM, pagamentos e logística conectados com rastreabilidade, filas e recuperação segura de falhas.',
    detail: 'REST · webhooks · eventos · ETL',
    signal: 'falhas observáveis',
  },
]

const clamp = value => Math.max(0, Math.min(1, value))
const lerp = (from, to, amount) => from + (to - from) * amount
const smoothstep = (from, to, value) => {
  const amount = clamp((value - from) / Math.max(.0001, to - from))
  return amount * amount * (3 - 2 * amount)
}

export default function CoreStory() {
  const [heroBeat, setHeroBeat] = useState(0)
  const [solutionBeat, setSolutionBeat] = useState(0)
  const [reduceMotion, setReduceMotion] = useState(() => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  const storyRef = useRef(null)
  const heroRef = useRef(null)
  const heroSceneRef = useRef(null)
  const solutionsRef = useRef(null)
  const solutionsSceneRef = useRef(null)

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReduceMotion(media.matches)
    update()
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [])

  useEffect(() => {
    const story = storyRef.current
    const hero = heroRef.current
    const heroScene = heroSceneRef.current
    const solutionsTrack = solutionsRef.current
    const solutionsScene = solutionsSceneRef.current
    if (!story || !hero || !heroScene || !solutionsTrack || !solutionsScene) return undefined

    const storyState = { progress: 0 }
    const pointer = { x: 0, y: 0 }
    const metrics = { storyTravel: 1, heroTravel: 1, solutionsStart: 1, solutionsTravel: 1 }
    let currentHeroBeat = -2
    let currentSolutionBeat = -2
    let pointerAnimation
    let pointerFrame = 0
    let pointerEnabled = false
    let layoutObserver
    let disposed = false

    const measure = () => {
      const storyBounds = story.getBoundingClientRect()
      const trackBounds = solutionsTrack.getBoundingClientRect()
      metrics.storyTravel = Math.max(1, story.offsetHeight - window.innerHeight)
      metrics.heroTravel = Math.max(1, hero.offsetHeight - heroScene.offsetHeight)
      metrics.solutionsStart = trackBounds.top - storyBounds.top
      metrics.solutionsTravel = Math.max(1, solutionsTrack.offsetHeight - solutionsScene.offsetHeight)
    }

    const paintHeroPanel = (panel, opacity, x) => {
      panel.style.setProperty('--beat-opacity', opacity.toFixed(4))
      panel.style.setProperty('--beat-x', `${x.toFixed(2)}px`)
      panel.style.setProperty('--beat-scale', (.985 + opacity * .015).toFixed(4))
    }

    const paintSolutionPanel = (panel, opacity, y) => {
      panel.style.setProperty('--solution-opacity', opacity.toFixed(4))
      panel.style.setProperty('--solution-y', `${y.toFixed(2)}px`)
      panel.style.setProperty('--solution-scale', (.985 + opacity * .015).toFixed(4))
    }

    const paint = () => {
      const scrollDistance = storyState.progress * metrics.storyTravel
      const heroProgress = clamp(scrollDistance / metrics.heroTravel)
      const solutionsProgress = clamp((scrollDistance - metrics.solutionsStart) / metrics.solutionsTravel)
      const introTravel = Math.max(1, metrics.solutionsStart - metrics.heroTravel)
      const introProgress = clamp((scrollDistance - metrics.heroTravel) / introTravel)
      const heroActive = scrollDistance <= metrics.heroTravel + 1
      const solutionsActive = scrollDistance >= metrics.solutionsStart - 1
      const heroMoments = [
        { id: 0, enter: null, exit: [.3, .42] },
      ]
      let visibleHeroBeat = -1
      let visibleHeroOpacity = -1
      heroMoments.forEach(({ id, enter, exit }) => {
        const panel = heroScene.querySelector(`[data-hero-beat="${id}"]`)
        if (!panel) return
        const entrance = enter ? smoothstep(enter[0], enter[1], heroProgress) : 1
        const departure = exit ? smoothstep(exit[0], exit[1], heroProgress) : 0
        const opacity = heroActive ? entrance * (1 - departure) : 0
        paintHeroPanel(panel, opacity, 0)
        if (opacity > visibleHeroOpacity) {
          visibleHeroOpacity = opacity
          visibleHeroBeat = id
        }
      })
      if (visibleHeroOpacity < .01) visibleHeroBeat = -1

      const solutionMoments = [
        { enter: [.03, .14], exit: [.22, .28] },
        { enter: [.34, .42], exit: [.48, .54] },
        { enter: [.6, .68], exit: [.86, .92] },
      ]
      let visibleSolutionBeat = -1
      solutionMoments.forEach(({ enter, exit }, index) => {
        const panel = solutionsScene.querySelector(`[data-solution-beat="${index}"]`)
        if (!panel) return
        const entrance = enter ? smoothstep(enter[0], enter[1], solutionsProgress) : 1
        const departure = exit ? smoothstep(exit[0], exit[1], solutionsProgress) : 0
        const opacity = solutionsActive ? entrance * (1 - departure) : 0
        const y = (1 - entrance) * 58 - departure * 40
        paintSolutionPanel(panel, opacity, y)
        if (opacity > .52) visibleSolutionBeat = index
      })

      if (visibleHeroBeat !== currentHeroBeat) {
        currentHeroBeat = visibleHeroBeat
        setHeroBeat(visibleHeroBeat)
      }
      if (visibleSolutionBeat !== currentSolutionBeat) {
        currentSolutionBeat = visibleSolutionBeat
        setSolutionBeat(visibleSolutionBeat)
      }

      const passageSettle = smoothstep(.06, .5, introProgress)
      const parallaxArrival = smoothstep(.02, .16, solutionsProgress)
      const parallaxTravel = smoothstep(.16, 1, solutionsProgress)

      const compactLayout = window.innerWidth <= 760
      const sideOffset = Math.min(20, (320 / Math.max(1, window.innerWidth)) * 100)
      const passageX = compactLayout ? 0 : Math.min(27, (410 / Math.max(1, window.innerWidth)) * 100)
      const passageY = compactLayout ? 12 : 6
      const passageScale = compactLayout ? .6 : .66
      const passageOpacity = compactLayout ? .82 : .86
      const solutionY = compactLayout ? 24 : 0
      const solutionScale = compactLayout ? .62 : .9
      const settledScale = compactLayout ? .62 : .82
      const heroFocus = smoothstep(.26, .46, heroProgress)
      const heroFocusScale = compactLayout ? 1.06 : 1.18
      let visualX = 0
      let visualY = 0
      let visualScale = .94
      let visualOpacity = 1
      if (heroActive) {
        visualX = lerp(sideOffset, 0, heroFocus)
        visualScale = lerp(.94, heroFocusScale, heroFocus)
      } else if (!solutionsActive) {
        visualX = lerp(0, passageX, passageSettle)
        visualY = lerp(0, passageY, passageSettle)
        visualScale = lerp(heroFocusScale, passageScale, passageSettle)
        visualOpacity = lerp(1, passageOpacity, passageSettle)
      } else if (solutionsActive) {
        // Cross the viewport only while both adjacent panels are fully hidden.
        const travelLeft = smoothstep(.28, .34, solutionsProgress)
        const travelRight = smoothstep(.54, .6, solutionsProgress)
        const settleCenter = smoothstep(.92, 1, solutionsProgress)
        const arrivalX = passageX
        visualX = lerp(lerp(lerp(arrivalX, -sideOffset, travelLeft), sideOffset, travelRight), 0, settleCenter)
        visualY = lerp(passageY, solutionY, parallaxArrival) + lerp(0, 2, parallaxTravel)
        const arrivalScale = lerp(passageScale, solutionScale, parallaxArrival)
        visualScale = lerp(arrivalScale, settledScale, smoothstep(.68, 1, solutionsProgress))
        visualOpacity = lerp(passageOpacity, 1, parallaxArrival)
      }

      if (compactLayout) visualX = 0

      const pointerAvailable = solutionsActive && solutionsProgress >= .16
      if (pointerEnabled !== pointerAvailable) {
        pointerEnabled = pointerAvailable
        if (!pointerEnabled) {
          pointerAnimation?.pause()
          pointer.x = 0
          pointer.y = 0
        }
      }
      const pointerWeight = solutionsActive ? smoothstep(.16, .24, solutionsProgress) : 0
      const pointerX = (pointerEnabled ? pointer.x : 0) * pointerWeight
      const pointerY = (pointerEnabled ? pointer.y : 0) * pointerWeight
      story.style.setProperty('--story-visual-x', `${(visualX + pointerX * .35).toFixed(3)}vw`)
      story.style.setProperty('--story-visual-y', `${(visualY + pointerY * .7).toFixed(3)}vh`)
      story.style.setProperty('--story-visual-scale', visualScale.toFixed(4))
      story.style.setProperty('--story-visual-opacity', visualOpacity.toFixed(4))
      story.style.setProperty('--hero-progress', heroProgress.toFixed(4))
      story.style.setProperty('--solutions-progress', solutionsProgress.toFixed(4))

      const explodeOut = smoothstep(.38, .64, heroProgress)
      const assembleBack = smoothstep(.72, .92, heroProgress)
      const cubeFocus = heroActive ? heroFocus : !solutionsActive ? 1 - passageSettle : 0
      const focusedCubeScale = compactLayout ? 1.05 : 1.1
      story.dataset.cubeExplode = (explodeOut * (1 - assembleBack)).toFixed(4)
      story.dataset.cubeDepth = '0'
      story.dataset.cubeDescent = '0'
      story.dataset.cubeScale = lerp(1, focusedCubeScale, cubeFocus).toFixed(4)
      story.dataset.cubeField = '1'
      story.dataset.parallaxPhase = heroActive ? 'hero' : solutionsActive && solutionsProgress >= .16 ? 'solutions' : 'passage'

      const activeBeat = solutionsActive ? visibleSolutionBeat : visibleHeroBeat
      const gravity = activeBeat === 1 ? 'left' : 'right'
      story.dataset.gravity = gravity
      heroScene.dataset.gravity = gravity
      solutionsScene.dataset.gravity = gravity
    }

    measure()
    paint()
    layoutObserver = new ResizeObserver(() => {
      measure()
      paint()
    })
    ;[hero, heroScene, solutionsTrack, solutionsScene].forEach(element => layoutObserver.observe(element))
    document.fonts?.ready.then(() => {
      if (disposed) return
      measure()
      paint()
    })

    const scope = createScope({
      root: story,
      mediaQueries: {
        reduceMotion: '(prefers-reduced-motion: reduce)',
        compact: '(max-width: 760px)',
      },
    }).add(self => {
      if (self.matches.reduceMotion) {
        storyState.progress = 0
        story.dataset.cubeExplode = '0'
        story.dataset.cubeDepth = '0'
        story.dataset.cubeDescent = '0'
        story.dataset.cubeScale = '1'
        paint()
        return undefined
      }

      animate(storyState, {
        progress: 1,
        duration: 1000,
        ease: 'linear',
        autoplay: onScroll({
          target: story,
          enter: 'start start',
          leave: 'end end',
          sync: .18,
          onResize: () => {
            measure()
            paint()
          },
        }),
        onUpdate: paint,
      })

      const queuePointer = (x, y) => {
        cancelAnimationFrame(pointerFrame)
        pointerFrame = requestAnimationFrame(() => {
          pointerAnimation?.pause()
          pointerAnimation = animate(pointer, {
            x,
            y,
            duration: self.matches.compact ? 240 : 420,
            ease: 'out(4)',
            onUpdate: paint,
          })
        })
      }
      const move = event => {
        if (!pointerEnabled || story.dataset.cubeDragging === 'true') return
        queuePointer(
          clamp(event.clientX / window.innerWidth) * 2 - 1,
          clamp(event.clientY / window.innerHeight) * 2 - 1,
        )
      }
      const reset = () => queuePointer(0, 0)
      const resize = () => {
        measure()
        paint()
      }

      story.addEventListener('pointermove', move, { passive: true })
      story.addEventListener('pointerleave', reset)
      window.addEventListener('resize', resize)
      return () => {
        cancelAnimationFrame(pointerFrame)
        story.removeEventListener('pointermove', move)
        story.removeEventListener('pointerleave', reset)
        window.removeEventListener('resize', resize)
      }
    })

    return () => {
      disposed = true
      layoutObserver?.disconnect()
      scope.revert()
    }
  }, [])

  return <div ref={storyRef} className="core-story" data-cube-motion data-gravity="right" data-parallax-phase="hero">
    <div className="core-story__visual">
      <div className="core-story__visual-stage">
        <div className="core-story__model">
          <ThreeDimensionalCore className="black-hole-3d--story" />
        </div>
      </div>
    </div>

    <section id="inicio" ref={heroRef} className="home-hero" data-header-theme="dark" aria-label="Abertura interativa VoidCube">
      <div ref={heroSceneRef} className="home-hero__scene" data-gravity="right">
        <div className="hero-copy hero-beat hero-beat--left" data-hero-beat="0" aria-hidden={heroBeat !== 0}>
          <p className="eyebrow"><span className="status-dot" /> Engenharia de software · Pará</p>
          <h1>Complexidade<br />entra. <em>Fluxo sai.</em></h1>
          <p className="hero-lede">Sistemas, automações e integrações para operações que precisam funcionar com clareza — inclusive nas exceções.</p>
          <div className="hero-actions">
            <Link tabIndex={heroBeat === 0 ? 0 : -1} className="button button--solid" to="/contato">Mapear minha operação <ArrowIcon /></Link>
            <Link tabIndex={heroBeat === 0 ? 0 : -1} className="text-link" to="/#projetos">Ver trabalho em produção <ArrowIcon size={15} /></Link>
          </div>
        </div>

      </div>
    </section>

    <section id="solucoes" className="solutions-section section-light">
      <header className="section-intro" data-reveal>
        <div><span className="section-index">Capacidades</span><h2>Uma base técnica.<br />Três frentes de trabalho.</h2></div>
        <p>Não empilhamos ferramentas. Desenhamos a menor estrutura capaz de tornar uma operação legível, conectada e sustentável.</p>
      </header>
      <div ref={solutionsRef} className="solutions-parallax">
        <div ref={solutionsSceneRef} className="solutions-parallax__scene" data-gravity="right">
          <div className="solutions-parallax__content">
            {capabilities.map((item, index) => {
              const modelOnRight = index !== 1
              return <article
                key={item.mode}
                className={`solution-beat solution-beat--${modelOnRight ? 'left' : 'right'}`}
                data-solution-beat={index}
                aria-hidden={reduceMotion ? false : solutionBeat !== index}
              >
                <div className="solution-beat__meta"><span>{item.code}</span><CapabilityIcon type={item.mode} /></div>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
                <footer><span>{item.detail}</span><b>{item.signal}</b></footer>
              </article>
            })}
          </div>
        </div>
      </div>
    </section>
  </div>
}

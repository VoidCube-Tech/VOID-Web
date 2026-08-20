import React, { useEffect, useRef, useState } from 'react'
import { motion, useMotionValueEvent, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion'
import { Braces, Network, Zap } from 'lucide-react'
import BlackHole from './originkit/BlackHole'
import RubikParticles from './originkit/RubikParticles'
import { SkiperLink } from './skiper/AnimatedLink'
import FoldText from './reactbits/FoldText'

const CORE_COLORS = ['#c8edff', '#5d9cff', '#24b7ff']
const VOID_STATES = ['idle', 'attract', 'process', 'automate', 'connect']

function useMediaQuery(query) {
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches)
  useEffect(() => {
    const media = window.matchMedia(query)
    const update = () => setMatches(media.matches)
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [query])
  return matches
}

const chapters = [
  {
    code: 'SYS / 01',
    eyebrow: 'Sistemas sob medida',
    title: ['A operação', 'define o', 'software.'],
    text: 'ERPs, portais e plataformas que seguem o fluxo real da empresa — inclusive quando o processo sai do caminho feliz.',
    detail: 'Arquitetura web · APIs · Aplicações internas',
    metric: '01',
    metricLabel: 'núcleo operacional',
    icon: Braces,
    side: 'right',
  },
  {
    code: 'AUT / 02',
    eyebrow: 'Automação de processos',
    title: ['Menos tarefas.', 'Mais decisões', 'humanas.'],
    text: 'Fluxos que conciliam dados, executam o trabalho repetitivo e encaminham cada exceção para a pessoa certa.',
    detail: 'Financeiro · Operações · Atendimento',
    metric: '24/7',
    metricLabel: 'orquestração ativa',
    icon: Zap,
    side: 'left',
  },
  {
    code: 'INT / 03',
    eyebrow: 'Integrações confiáveis',
    title: ['Cada sistema.', 'Um único', 'movimento.'],
    text: 'ERP, CRM, pagamentos e logística conectados com rastreabilidade, filas e recuperação segura de falhas.',
    detail: 'REST · Webhooks · Eventos · ETL',
    metric: '42ms',
    metricLabel: 'latência do núcleo',
    icon: Network,
    side: 'right',
  },
]

function CoreScene({ voidState, particleCount, disassemble = false }) {
  return <div className="story-core" role="img" aria-label="Cubo modular orbitando no centro de uma singularidade digital">
    <div className="story-core__blackhole">
      <BlackHole
        showCenter={false}
        disassemble={disassemble && voidState === 'attract'}
        particleCount={particleCount}
        particleSize={6.5}
        colors={CORE_COLORS}
        outerRadius={88}
        tilt={19}
        tiltSideway={158}
        trail={42}
        orbitSpeed={3.15}
        pullSpeed={0.18}
        centre={{ voidRadius: 70, voidX: 50, voidY: 50 }}
        style={{ background: 'transparent' }}
      >
        <div className="story-core__cube">
          <RubikParticles
            color="#54c4ff"
            cubeGrid={3}
            dotsPerFace={3}
            dotSize={2}
            sizePercent={100}
            layerMotion={false}
            disassemble={disassemble && voidState === 'attract'}
            rotation={{ x: 1.5, y: 1.8, z: 0.8 }}
          />
        </div>
      </BlackHole>
    </div>
    <div className="story-core__assembly" aria-hidden="true"><i /><i /><i /></div>
    <div className="story-core__flow" aria-hidden="true"><i /><i /><i /></div>
    <div className="story-core__nodes" aria-hidden="true"><i /><i /><i /><i /></div>
  </div>
}

function Metric({ value, label, active }) {
  const ref = useRef(null)

  useEffect(() => {
    if (!active || value !== '42ms' || !ref.current) return undefined
    const node = ref.current
    const startedAt = performance.now()
    let frame
    const update = now => {
      const progress = Math.min(1, (now - startedAt) / 680)
      node.textContent = `${Math.round(42 * (1 - Math.pow(1 - progress, 3)))}ms`
      if (progress < 1) frame = requestAnimationFrame(update)
    }
    frame = requestAnimationFrame(update)
    return () => cancelAnimationFrame(frame)
  }, [active, value])

  return <div><strong ref={ref}>{value}</strong><small>{label}</small></div>
}

function MobileCoreStory({ particleCount }) {
  return <section id="solucoes" className="core-story-mobile" data-header-theme="dark">
    <div className="mobile-core-hero"><div className="mobile-core-copy"><div className="eyebrow"><span className="live-dot" /> Engenharia de software · Brasil</div><h1>Complexidade<br/>entra.<em>Fluxo sai.</em></h1><p>Projetamos sistemas, automações e integrações que transformam operações fragmentadas em estruturas claras, rastreáveis e prontas para crescer.</p><SkiperLink className="button primary" href="/contato" variant="fill">Mapear minha operação</SkiperLink></div><div className="mobile-core-scene"><CoreScene voidState="idle" particleCount={particleCount}/></div></div>
    <div className="mobile-chapters">{chapters.map(chapter => { const Icon = chapter.icon; return <article key={chapter.code}><div><Icon size={14}/>{chapter.eyebrow}</div><h2>{chapter.title.map(line => <span key={line}>{line}</span>)}</h2><p>{chapter.text}</p><div className="mobile-chapter-foot"><span>{chapter.detail}</span><Metric value={chapter.metric} label={chapter.metricLabel} active={false}/></div></article> })}</div>
  </section>
}

function Chapter({ chapter, index, active, replayKey }) {
  const Icon = chapter.icon

  return <article className={`story-chapter story-chapter--${chapter.side}`} data-chapter={index + 2} data-active={active}>
    <div className="story-chapter__meta"><span><Icon size={13} /> {chapter.eyebrow}</span></div>
    <h2>{chapter.title.map((line, lineIndex) => <span key={line}>{active ? <FoldText key={`${replayKey}-${lineIndex}`} text={line} splitBy="line" hinge="top" duration={0.76} stagger={0} delay={0.12 + lineIndex * 0.08} foldAmount={0.38} lift={14} /> : line}</span>)}</h2>
    <p>{chapter.text}</p>
    <div className="story-chapter__foot"><span>{chapter.detail}</span><Metric value={chapter.metric} label={chapter.metricLabel} active={active} /></div>
    <SkiperLink href="/contato" variant="line">Explorar solução</SkiperLink>
  </article>
}

export default function CoreStory() {
  const ref = useRef(null)
  const stickyRef = useRef(null)
  const reduceMotion = useReducedMotion()
  const isMobile = useMediaQuery('(max-width: 650px)')
  const [phase, setPhase] = useState(0)
  const [revealCycle, setRevealCycle] = useState(0)
  const phaseRef = useRef(0)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 96, damping: 24, mass: 0.38, restDelta: 0.001 })
  const stage = Math.min(4, Math.floor(phase / 2))
  const isTransition = reduceMotion ? false : phase % 2 === 1
  const isSettled = !isTransition
  const voidState = VOID_STATES[stage]
  const particleCount = reduceMotion ? 120 : window.innerWidth < 650 ? 300 : window.innerWidth < 1100 || navigator.hardwareConcurrency <= 4 ? 680 : 1350

  useEffect(() => {
    const element = stickyRef.current
    if (!element || reduceMotion) return undefined
    let frame
    const updateGravity = event => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const rect = element.getBoundingClientRect()
        element.style.setProperty('--gravity-x', `${((event.clientX - rect.left) / rect.width) * 100}%`)
        element.style.setProperty('--gravity-y', `${((event.clientY - rect.top) / rect.height) * 100}%`)
      })
    }
    element.addEventListener('pointermove', updateGravity, { passive: true })
    return () => {
      cancelAnimationFrame(frame)
      element.removeEventListener('pointermove', updateGravity)
    }
  }, [reduceMotion])

  const introY = useTransform(smoothProgress, [0, 0.24], [0, reduceMotion ? 0 : -72])
  const sceneX = useTransform(
    smoothProgress,
    [0, 0.12, 0.2, 0.36, 0.44, 0.56, 0.64, 0.76, 0.84, 0.95, 1],
    reduceMotion
      ? ['0vw', '0vw', '0vw', '0vw', '0vw', '0vw', '0vw', '0vw', '0vw', '0vw', '0vw']
      : ['18vw', '18vw', '0vw', '0vw', '-20vw', '-20vw', '20vw', '20vw', '-20vw', '-20vw', '0vw'],
  )
  const sceneScale = useTransform(
    smoothProgress,
    [0, 0.15, 0.2, 0.36, 0.44, 0.94, 1],
    reduceMotion ? [0.82, 0.82, 0.82, 0.82, 0.82, 0.82, 0.82] : [1, 1, 0.82, 0.82, 0.78, 0.78, 0.7],
  )
  const sceneOpacity = useTransform(
    smoothProgress,
    [0, 0.94, 0.985, 1],
    reduceMotion ? [1, 1, 1, 1] : [1, 1, 0.38, 0],
  )
  const sceneY = useTransform(
    smoothProgress,
    [0, 0.2, 0.44, 0.64, 0.84, 1],
    reduceMotion ? ['0vh', '0vh', '0vh', '0vh', '0vh', '0vh'] : ['0vh', '-1.8vh', '1.5vh', '-1.5vh', '1.2vh', '0vh'],
  )
  const sceneRotate = useTransform(
    smoothProgress,
    [0, 0.2, 0.44, 0.64, 0.84, 1],
    reduceMotion ? [0, 0, 0, 0, 0, 0] : [-2, 0, -3.5, 3.5, -3, 0],
  )
  const ambientY = useTransform(smoothProgress, [0, 1], reduceMotion ? ['0%', '0%'] : ['2%', '-8%'])
  const handoffOpacity = useTransform(smoothProgress, [0.88, 0.955, 1], reduceMotion ? [0, 0, 0] : [0, 0.62, 1])
  const handoffY = useTransform(smoothProgress, [0.88, 1], reduceMotion ? ['18vh', '18vh'] : ['24vh', '-3vh'])
  const apertureScale = useTransform(smoothProgress, [0.03, 0.16, 0.31], reduceMotion ? [1, 1, 1] : [0.78, 1.04, 1])
  const apertureOpacity = useTransform(smoothProgress, [0.02, 0.13, 0.3], reduceMotion ? [1, 1, 1] : [0, 0.88, 1])
  // Odd phases are travel windows: copy leaves first, then the core crosses
  // the frame, and only after it settles does the next chapter enter.
  useMotionValueEvent(smoothProgress, 'change', value => {
    const next = value < 0.16
      ? 0
      : value < 0.2
        ? 1
        : value < 0.36
          ? 2
          : value < 0.44
            ? 3
            : value < 0.56
              ? 4
              : value < 0.64
                ? 5
                : value < 0.76
                  ? 6
                  : value < 0.84
                    ? 7
                    : value < 0.94
                      ? 8
                      : 9
    if (phaseRef.current === next) return
    phaseRef.current = next
    setPhase(next)
    if (next % 2 === 0) setRevealCycle(cycle => cycle + 1)
  })

  if (isMobile) return <MobileCoreStory particleCount={particleCount}/>

  return <section ref={ref} id="solucoes" className="core-story" data-stage={stage} data-transition={isTransition} data-void-state={voidState} data-header-theme="dark">
    <div ref={stickyRef} className="core-story__sticky">
      <motion.div className="core-story__grid" style={{ y: ambientY }} aria-hidden="true" />
      <svg className="core-story__contours" viewBox="0 0 1440 900" fill="none" aria-hidden="true">
        <path d="M-80 178C190 4 302 256 554 91c237-155 358 78 573-24 176-83 279-57 420 44" />
        <path d="M-45 733c237-167 393 50 601-76 260-158 340 118 592-35 144-88 253-75 375 12" />
        <path d="M194-60c142 134 20 242 156 351 153 122 36 241 170 352 94 78 100 167 69 263" />
        <path d="M1120-63c-84 157 42 237-61 387-111 163 56 243-45 393-52 77-40 145 2 220" />
      </svg>

      <motion.div className="core-story__aperture" style={{ scale: apertureScale, opacity: apertureOpacity }} />
      <motion.div className="core-story__scene" style={{ x: sceneX, y: sceneY, scale: sceneScale, rotate: sceneRotate, opacity: sceneOpacity }}><CoreScene voidState={voidState} particleCount={particleCount} disassemble={!reduceMotion} /></motion.div>
      <motion.div className="core-story__handoff" style={{ opacity: handoffOpacity, y: handoffY }} aria-hidden="true"><i/><i/><i/></motion.div>

      <motion.div className="core-story__intro" style={{ y: introY }}>
        <div className="eyebrow"><span className="live-dot" /> Engenharia de software · São Paulo</div>
        <h1><span>{stage === 0 && isSettled ? <FoldText key={`intro-a-${revealCycle}`} text="Complexidade" splitBy="char" duration={0.7} stagger={0.026} delay={0.08} foldAmount={0.55} lift={8} /> : 'Complexidade'}</span><span>{stage === 0 && isSettled ? <FoldText key={`intro-b-${revealCycle}`} text="entra." splitBy="char" hinge="top" duration={0.66} stagger={0.035} delay={0.16} foldAmount={0.48} lift={9} /> : 'entra.'}</span><em>{stage === 0 && isSettled ? <FoldText key={`intro-c-${revealCycle}`} text="Fluxo sai." splitBy="word" hinge="bottom" duration={0.7} stagger={0.055} delay={0.24} foldAmount={0.42} lift={10} /> : 'Fluxo sai.'}</em></h1>
        <p>Projetamos sistemas, automações e integrações que transformam operações fragmentadas em uma estrutura clara, rastreável e pronta para crescer.</p>
        <div className="hero-actions"><SkiperLink className="button primary" href="/contato" variant="fill">Mapear minha operação</SkiperLink><SkiperLink className="text-link" href="/#projetos" variant="line">Ver projetos</SkiperLink></div>
      </motion.div>

      {chapters.map((chapter, index) => <Chapter key={chapter.code} chapter={chapter} index={index} active={stage === index + 2 && isSettled} replayKey={revealCycle} />)}

      <div className="core-story__hud" aria-hidden="true"><div><i style={{ transform: `scaleX(${(stage + 1) / 5})` }} /></div></div>
    </div>
  </section>
}

import React, { useRef, useState } from 'react'
import { motion, useMotionValueEvent, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion'
import { ArrowDownRight, Braces, Network, Sparkles, Zap } from 'lucide-react'
import BlackHole from './originkit/BlackHole'
import RubikParticles from './originkit/RubikParticles'
import { SkiperLink } from './skiper/AnimatedLink'

const CORE_COLORS = ['#eef5ff', '#5d8fff', '#d9ad52']

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

function CoreScene() {
  return <div className="story-core" role="img" aria-label="Cubo modular orbitando no centro de uma singularidade digital">
    <div className="story-core__blackhole">
      <BlackHole
        showCenter={false}
        particleCount={760}
        particleSize={6}
        colors={CORE_COLORS}
        outerRadius={84}
        tilt={14}
        tiltSideway={163}
        trail={40}
        orbitSpeed={3.1}
        pullSpeed={0.22}
        centre={{ voidRadius: 70, voidX: 50, voidY: 50 }}
        style={{ background: 'transparent' }}
      >
        <div className="story-core__cube">
          <RubikParticles color="#69a7ff" cubeGrid={4} dotsPerFace={4} dotSize={3} sizePercent={84} />
        </div>
      </BlackHole>
    </div>
    <div className="story-core__axis story-core__axis--x"><i /><i /></div>
    <div className="story-core__axis story-core__axis--y"><i /><i /></div>
    <span className="story-core__label story-core__label--a">PROCESSO / DECISÃO</span>
    <span className="story-core__label story-core__label--b">DADO → AÇÃO</span>
  </div>
}

function Chapter({ chapter, index }) {
  const Icon = chapter.icon

  return <article className={`story-chapter story-chapter--${chapter.side}`} data-chapter={index + 2}>
    <div className="story-chapter__meta"><span>{chapter.code}</span><span><Icon size={13} /> {chapter.eyebrow}</span></div>
    <h2>{chapter.title.map(line => <span key={line}>{line}</span>)}</h2>
    <p>{chapter.text}</p>
    <div className="story-chapter__foot"><span>{chapter.detail}</span><div><strong>{chapter.metric}</strong><small>{chapter.metricLabel}</small></div></div>
    <SkiperLink href="#contato" variant="line">Explorar solução</SkiperLink>
  </article>
}

export default function CoreStory() {
  const ref = useRef(null)
  const reduceMotion = useReducedMotion()
  const [phase, setPhase] = useState(0)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 115, damping: 30, mass: 0.22, restDelta: 0.001 })
  const stage = Math.min(4, Math.floor(phase / 2))
  const isTransition = reduceMotion ? false : phase % 2 === 1

  const introY = useTransform(smoothProgress, [0, 0.24], [0, reduceMotion ? 0 : -72])
  const messageScale = useTransform(
    smoothProgress,
    [0.18, 0.24, 0.36, 0.44],
    reduceMotion ? [1, 1, 1, 1] : [0.96, 1, 1, 0.98],
  )
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
  const sceneRotate = useTransform(smoothProgress, [0, 1], [0, reduceMotion ? 0 : 8])
  const apertureScale = useTransform(smoothProgress, [0.08, 0.2, 0.33], [0, 1, 1])
  const marqueeX = useTransform(
    smoothProgress,
    [0.2, 0.44],
    reduceMotion ? ['-12vw', '-12vw'] : ['8vw', '-32vw'],
  )

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
    setPhase(previous => previous === next ? previous : next)
  })

  return <section ref={ref} id="solucoes" className="core-story" data-stage={stage} data-transition={isTransition}>
    <div className="core-story__sticky">
      <div className="core-story__grid" aria-hidden="true" />
      <svg className="core-story__contours" viewBox="0 0 1440 900" fill="none" aria-hidden="true">
        <path d="M-80 178C190 4 302 256 554 91c237-155 358 78 573-24 176-83 279-57 420 44" />
        <path d="M-45 733c237-167 393 50 601-76 260-158 340 118 592-35 144-88 253-75 375 12" />
        <path d="M194-60c142 134 20 242 156 351 153 122 36 241 170 352 94 78 100 167 69 263" />
        <path d="M1120-63c-84 157 42 237-61 387-111 163 56 243-45 393-52 77-40 145 2 220" />
      </svg>

      <motion.div className="core-story__aperture" style={{ scaleY: apertureScale }} />
      <motion.div className="core-story__scene" style={{ x: sceneX, scale: sceneScale, rotate: sceneRotate, opacity: sceneOpacity }}><CoreScene /></motion.div>

      <motion.div className="core-story__intro" style={{ y: introY }}>
        <div className="eyebrow"><span className="live-dot" /> Engenharia de software · São Paulo</div>
        <h1><span>Complexidade</span><span>entra.</span><em>Fluxo sai.</em></h1>
        <p>Projetamos sistemas, automações e integrações que transformam operações fragmentadas em uma estrutura clara, rastreável e pronta para crescer.</p>
        <div className="hero-actions"><SkiperLink className="button primary" href="#contato" variant="fill">Mapear minha operação</SkiperLink><SkiperLink className="text-link" href="#projetos" variant="line">Ver projetos</SkiperLink></div>
      </motion.div>

      <motion.div className="core-message" style={{ scale: messageScale }}>
        <span className="core-message__eyebrow"><Sparkles size={12} /> MENSAGEM DO NÚCLEO</span>
        <motion.div className="core-message__marquee" style={{ x: marqueeX }} aria-hidden="true">
          <span>ENGENHARIA PARA O QUE NÃO PODE PARAR</span><span>ENGENHARIA PARA O QUE NÃO PODE PARAR</span>
        </motion.div>
        <p>Se dá trabalho para entender,<br />o sistema ainda não está <strong>pronto.</strong></p>
      </motion.div>

      {chapters.map((chapter, index) => <Chapter key={chapter.code} chapter={chapter} index={index} />)}

      <div className="core-story__hud" aria-hidden="true">
        <span>VOID SYSTEMS / CORE SEQUENCE</span><div><i style={{ transform: `scaleX(${(stage + 1) / 5})` }} /></div><b>0{stage + 1} / 05</b>
      </div>
      <div className="core-story__scroll"><ArrowDownRight size={15} /><span>Role para atravessar o núcleo</span></div>
    </div>
  </section>
}

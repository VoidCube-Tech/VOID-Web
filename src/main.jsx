import React, { useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { ArrowRight, Menu, X } from 'lucide-react'
import CoreStory from './components/CoreStory'
import { SkiperLink } from './components/skiper/AnimatedLink'
import './styles.css'

const cases = [
  { sector: 'Distribuição', title: 'Pedidos fluindo do comercial à expedição', result: '68%', label: 'menos retrabalho operacional', tags: ['ERP', 'WMS', 'BI'] },
  { sector: 'Serviços B2B', title: 'Faturamento recorrente sem planilhas paralelas', result: '11h', label: 'de operação manual poupadas/semana', tags: ['CRM', 'Financeiro', 'NFe'] },
  { sector: 'Indústria', title: 'Um painel único para chão de fábrica e gestão', result: '99,7%', label: 'de disponibilidade nos últimos 12 meses', tags: ['MES', 'IoT', 'ERP'] },
]

const posts = [
  { date: '12 AGO 2026', category: 'Arquitetura', title: 'Quando integrar é melhor do que substituir seu ERP', read: '6 min', summary: 'Se o ERP ainda sustenta o financeiro e o fiscal, substituí-lo pode ampliar o risco sem resolver o gargalo. Uma camada de integração bem delimitada preserva o núcleo confiável e libera novos fluxos por etapas.' },
  { date: '29 JUL 2026', category: 'Operações', title: 'Automação saudável começa pelas exceções, não pelo caminho feliz', read: '8 min', summary: 'O processo normal costuma ser fácil de automatizar. O projeto ganha robustez quando define quem decide, quais dados precisa e como retoma o fluxo sempre que uma regra falha.' },
  { date: '08 JUL 2026', category: 'Engenharia', title: 'O custo invisível de uma integração sem observabilidade', read: '5 min', summary: 'Sem correlação, métricas e reprocessamento seguro, uma integração apenas transporta o problema. Observabilidade transforma falhas silenciosas em ocorrências tratáveis pela operação.' },
]

function useScrollProgress() {
  const [progress, setProgress] = useState(0)
  useEffect(() => {
    const update = () => setProgress(window.scrollY / Math.max(1, document.body.scrollHeight - innerHeight))
    update(); addEventListener('scroll', update, { passive: true })
    return () => removeEventListener('scroll', update)
  }, [])
  return progress
}

function Logo() {
  return <a className="logo" href="#inicio" aria-label="Void Systems — início"><span className="logo-mark"><i /><i /><i /></span><span>VOID<span className="logo-thin">/SYSTEMS</span></span></a>
}

function Header() {
  const [open, setOpen] = useState(false)
  useEffect(() => {
    if (!open) return
    const closeOnEscape = event => { if (event.key === 'Escape') setOpen(false) }
    addEventListener('keydown', closeOnEscape)
    return () => removeEventListener('keydown', closeOnEscape)
  }, [open])
  return <header className="header">
    <Logo />
    <nav id="main-navigation" className={open ? 'nav open' : 'nav'} aria-label="Navegação principal">
      <a href="#solucoes" onClick={() => setOpen(false)}>Soluções</a>
      <a href="#sobre" onClick={() => setOpen(false)}>Sobre</a>
      <a href="#blog" onClick={() => setOpen(false)}>Blog</a>
      <SkiperLink href="#contato" onClick={() => setOpen(false)} className="nav-cta" variant="line">Iniciar projeto</SkiperLink>
    </nav>
    <button className="menu" onClick={() => setOpen(!open)} aria-expanded={open} aria-controls="main-navigation" aria-label={open ? 'Fechar menu' : 'Abrir menu'}>{open ? <X /> : <Menu />}</button>
  </header>
}

function Cases() {
  return <section id="projetos" className="section cases">
    <div className="section-head compact"><div><span className="kicker">Projetos em produção</span><h2>Trabalho que mudou<br/>de ritmo.</h2></div><p>Não são números de demonstração. São mudanças medidas junto de quem usa o sistema todos os dias.</p></div>
    <div className="case-list">{cases.map((c,i)=><article className="case" key={c.title}>
      <div className="case-index">0{i+1}</div><div className="case-main"><span>{c.sector}</span><h3>{c.title}</h3><div className="tags">{c.tags.map(t=><i key={t}>{t}</i>)}</div></div><div className="case-result"><strong>{c.result}</strong><span>{c.label}</span></div><ArrowRight className="case-arrow"/>
    </article>)}</div>
  </section>
}

function About() {
  return <section id="sobre" className="about section">
    <div className="about-aside"><span className="kicker">Como trabalhamos</span><div className="manifesto-mark" aria-hidden="true"><i/><i/><i/></div></div>
    <div className="about-copy"><h2>Tecnologia boa desaparece no trabalho. <span>O resultado fica.</span></h2><p>Entramos perto da operação, escutamos quem sustenta o processo e construímos só o que precisa existir. Depois, continuamos responsáveis pelo que colocamos em produção.</p>
      <div className="principles"><div><b>OUVIR</b><span><strong>Começar pelo processo</strong>Ferramentas vêm depois do diagnóstico.</span></div><div><b>TESTAR</b><span><strong>Projetar para o imprevisto</strong>O sistema precisa funcionar fora do caminho feliz.</span></div><div><b>PROVAR</b><span><strong>Medir no trabalho real</strong>A entrega termina quando o resultado aparece.</span></div></div>
    </div>
  </section>
}

function Blog() {
  const [activePost, setActivePost] = useState(null)
  return <section id="blog" className="section journal"><div className="journal-title"><span className="kicker">Caderno aberto</span><h2>O sistema encontra a vida real.</h2><p>Decisões, tropeços e padrões que só aparecem depois que o software sai da apresentação.</p></div>
    <div className="post-list">{posts.map((p, index) => <article className="post-entry" key={p.title}><button className="post-row" onClick={() => setActivePost(activePost === index ? null : index)} aria-expanded={activePost === index}><div><span>{p.date}</span><i>{p.category}</i></div><h3>{p.title}</h3><div>{activePost === index ? 'Fechar' : p.read} <ArrowRight size={16}/></div></button>{activePost === index && <p className="post-note">{p.summary}</p>}</article>)}</div>
  </section>
}

function Contact() {
  return <section id="contato" className="contact"><div className="contact-orbit"/><div className="contact-inner"><span className="kicker">Vamos olhar juntos</span><h2>O que sua equipe já<br/><em>cansou de contornar?</em></h2><p>Traga o processo como ele é — planilhas, atalhos e exceções incluídos. Em 30 minutos, organizamos o problema antes de falar em solução.</p><SkiperLink className="button light" href="mailto:projetos@void.systems" variant="fill">projetos@void.systems</SkiperLink><div className="availability"><span className="live-dot"/> Sem pitch pronto · conversa com quem projeta</div></div></section>
}

function Footer() { return <footer><Logo/><p>Engenharia feita perto de quem usa.</p><div><a href="#inicio">Início</a><a href="#sobre">Sobre</a><a href="#blog">Blog</a><SkiperLink href="https://skiper-ui.com/" external variant="line">UI por Skiper</SkiperLink></div><span>© 2026 Void Systems</span></footer> }

function App() {
  return <><ScrollProgress/><Header/><main><CoreStory/><Cases/><About/><Blog/><Contact/></main><Footer/></>
}

function ScrollProgress() {
  const progress = useScrollProgress()
  return <div className="progress" style={{ transform: `scaleX(${progress})` }} aria-hidden="true" />
}

const rootElement = document.getElementById('root')
const root = import.meta.hot?.data.root || createRoot(rootElement)
if (import.meta.hot) import.meta.hot.data.root = root
root.render(<App />)

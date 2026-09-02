import React from 'react'
import { Link } from 'react-router-dom'
import CoreStory from '../components/CoreStory'
import { ArrowIcon } from '../components/Icons'
import { posts, projects } from '../content/siteContent'
import { usePageMeta } from '../hooks/usePageMeta'

function Projects() {
  return <section id="projetos" className="projects-section section-dark">
    <header className="section-intro section-intro--dark" data-reveal>
      <div><span className="section-index">02 / Em produção</span><h2>O trabalho muda.<br />O resultado aparece.</h2></div>
      <p>Projetos medidos junto de quem sustenta a operação todos os dias — sem métricas de demonstração.</p>
    </header>
    <div className="project-list">
      {projects.map((project, index) => <Link className="project-row" to={`/blog/${project.slug}`} key={project.slug} data-reveal>
        <span className="project-number">{String(index + 1).padStart(2, '0')}</span>
        <div className="project-copy"><span>{project.sector}</span><h3>{project.title}</h3><p>{project.tags.join(' · ')}</p></div>
        <div className="project-outcome"><strong>{project.result}</strong><span>{project.metricLabel}</span></div>
        <ArrowIcon className="project-arrow" />
      </Link>)}
    </div>
  </section>
}

function Method() {
  const principles = [
    ['Ouvir', 'Começar pelo processo', 'Ferramentas vêm depois do diagnóstico.'],
    ['Testar', 'Projetar para o imprevisto', 'O sistema precisa funcionar fora do caminho feliz.'],
    ['Provar', 'Medir no trabalho real', 'A entrega termina quando o resultado aparece.'],
  ]
  return <section className="method-section section-light">
    <div className="method-statement" data-reveal><span className="section-index">03 / Método</span><h2>Tecnologia boa desaparece no trabalho. <em>O resultado fica.</em></h2></div>
    <div className="method-body" data-reveal>
      <p>Somos uma empresa paraense de desenvolvimento. Entramos perto da operação, escutamos quem sustenta o processo e construímos só o que precisa existir.</p>
      <Link className="text-link text-link--dark" to="/sobre">Como trabalhamos <ArrowIcon size={15} /></Link>
    </div>
    <div className="principle-list">
      {principles.map(([verb, title, text], index) => <article key={verb} data-reveal><span>{String(index + 1).padStart(2, '0')}</span><div><b>{verb}</b><h3>{title}</h3><p>{text}</p></div></article>)}
    </div>
  </section>
}

function JournalPreview() {
  return <section className="journal-section">
    <div className="journal-heading" data-reveal><span className="section-index">04 / VOID·LOG</span><h2>Decisões de engenharia, sem a parte polida.</h2><p>O que aprendemos quando o sistema encontra planilhas, exceções e trabalho real.</p><Link className="button button--ink" to="/blog">Abrir caderno <ArrowIcon /></Link></div>
    <div className="journal-list">
      {posts.map((post, index) => <Link className="journal-row" to={`/blog/${post.slug}`} key={post.slug} data-reveal>
        <span>{String(index + 1).padStart(2, '0')}</span><div><small>{post.category} · {post.date}</small><h3>{post.title}</h3></div><b>{post.read}</b><ArrowIcon size={16}/>
      </Link>)}
    </div>
  </section>
}

function FinalCTA() {
  return <section className="final-cta">
    <div data-reveal><span className="section-index">05 / Começar</span><h2>Qual processo sua equipe já cansou de contornar?</h2></div>
    <div data-reveal><p>Traga o fluxo como ele é — atalhos, planilhas e exceções incluídos. Organizamos o problema antes de falar em solução.</p><Link className="button button--solid" to="/contato">Iniciar conversa <ArrowIcon /></Link><small><span className="status-dot"/> Sem pitch pronto · conversa com quem projeta</small></div>
  </section>
}

export default function HomePage() {
  usePageMeta('VoidCube — Engenharia de software no Pará', 'Sistemas, automações e integrações criados em Belém e Ananindeua para operações que não podem parar.')
  return <div className="home-page"><CoreStory/><Projects/><Method/><JournalPreview/><FinalCTA/></div>
}

import React from 'react'
import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import CoreStory from '../components/CoreStory'
import { SkiperLink } from '../components/skiper/AnimatedLink'
import { posts, projects } from '../content/siteContent'
import { usePageMeta } from '../hooks/usePageMeta'

function Projects() {
  return <section id="projetos" className="section cases" data-header-theme="light">
    <div className="section-head compact"><div><span className="kicker">Projetos em produção</span><h2>Trabalho que mudou<br/>de ritmo.</h2></div><p>Não são números de demonstração. São mudanças medidas junto de quem usa o sistema todos os dias.</p></div>
    <div className="case-list">{projects.map((project, index) => <Link className="case" to={`/blog/${project.slug}`} key={project.slug}>
      <div className="case-index">0{index + 1}</div><div className="case-main"><span>{project.sector}</span><h3>{project.title}</h3><div className="tags">{project.tags.map(tag => <i key={tag}>{tag}</i>)}</div></div><div className="case-result"><strong>{project.result}</strong><span>{project.metricLabel}</span></div><ArrowRight className="case-arrow"/>
    </Link>)}</div>
  </section>
}

function Method() {
  return <section id="metodo" className="about section" data-header-theme="dark">
    <div className="about-aside"><span className="kicker">Como trabalhamos</span><div className="manifesto-mark" aria-hidden="true"><i/><i/><i/></div></div>
    <div className="about-copy"><h2>Tecnologia boa desaparece no trabalho. <span>O resultado fica.</span></h2><p>Entramos perto da operação, escutamos quem sustenta o processo e construímos só o que precisa existir. Depois, continuamos responsáveis pelo que colocamos em produção.</p>
      <div className="principles"><div><b>OUVIR</b><span><strong>Começar pelo processo</strong>Ferramentas vêm depois do diagnóstico.</span></div><div><b>TESTAR</b><span><strong>Projetar para o imprevisto</strong>O sistema precisa funcionar fora do caminho feliz.</span></div><div><b>PROVAR</b><span><strong>Medir no trabalho real</strong>A entrega termina quando o resultado aparece.</span></div></div>
    </div>
  </section>
}

function JournalPreview() {
  return <section id="blog" className="section journal" data-header-theme="light"><div className="journal-title"><span className="kicker">Caderno aberto</span><h2>O sistema encontra a vida real.</h2><p>Decisões, tropeços e padrões que só aparecem depois que o software sai da apresentação.</p><SkiperLink className="journal-cta" href="/blog" variant="line">Abrir caderno</SkiperLink></div>
    <div className="post-list">{posts.map(post => <article className="post-entry" key={post.slug}><Link className="post-row" to={`/blog/${post.slug}`}><div><span>{post.date}</span><i>{post.category}</i></div><h3>{post.title}</h3><div>{post.read}<ArrowRight size={16}/></div></Link></article>)}</div>
  </section>
}

function FinalCTA() {
  return <section className="contact" data-header-theme="dark"><div className="contact-orbit"/><div className="contact-glyph" aria-hidden="true"><i/><i/><i/></div><div className="contact-inner"><span className="kicker">Vamos olhar juntos</span><h2>O que sua equipe já<br/><em>cansou de contornar?</em></h2><p>Traga o processo como ele é — planilhas, atalhos e exceções incluídos. Organizamos o problema antes de falar em solução.</p><SkiperLink className="button light" href="/contato" variant="fill">Iniciar projeto</SkiperLink><div className="availability"><span className="live-dot"/> Sem pitch pronto · conversa com quem projeta</div></div></section>
}

export default function HomePage() {
  usePageMeta('Void Systems — Software para operações reais', 'Engenharia de software, automações e integrações para operações que não podem parar.')
  return <div id="inicio" className="home-page"><CoreStory/><Projects/><Method/><JournalPreview/><FinalCTA/></div>
}

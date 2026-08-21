import React from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { journalItems } from '../content/siteContent'
import { SkiperLink } from '../components/skiper/AnimatedLink'
import { usePageMeta } from '../hooks/usePageMeta'

export default function ArticlePage() {
  const { slug } = useParams()
  const item = journalItems.find(entry => entry.slug === slug)
  usePageMeta(item ? `${item.title} - VoidCube` : 'Conteúdo não encontrado - VoidCube', item?.summary || 'Conteúdo não encontrado.')
  if (!item) return <Navigate to="/blog" replace />
  const related = journalItems.find(entry => entry.slug !== item.slug && entry.category === item.category) || journalItems.find(entry => entry.slug !== item.slug)

  return <article className="article-page">
    <header className="article-hero" data-header-theme="dark"><div className="article-meta"><span>{item.category}</span><span>{item.date}</span><span>{item.read}</span></div><h1>{item.title}</h1><p>{item.summary}</p>{item.type === 'project' && <div className="article-metric"><strong>{item.result}</strong><span>{item.metricLabel}</span></div>}</header>
    <div className="article-body" data-header-theme="light"><aside><span>VOID/LOG</span><Link to="/blog">Voltar ao caderno</Link></aside><div>{item.sections.map(([title, text]) => <section key={title}><h2>{title}</h2><p>{text}</p></section>)}{item.tags && <div className="article-tags">{item.tags.map(tag => <span key={tag}>{tag}</span>)}</div>}</div></div>
    {related && <section className="related-entry" data-header-theme="dark"><span className="kicker">Continuar lendo</span><h2>{related.title}</h2><SkiperLink href={`/blog/${related.slug}`} variant="line">Abrir conteúdo relacionado</SkiperLink></section>}
  </article>
}

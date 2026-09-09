import React from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { ArrowIcon } from '../components/Icons'
import { usePageMeta } from '../hooks/usePageMeta'
import { useTranslation } from 'react-i18next'
import "../style/blog.css"

export default function ArticlePage() {
  const { t } = useTranslation('home')
  const journalItems = [
    ...t('projects.items', { returnObjects: true }),
    ...t('journal.items', { returnObjects: true }),
  ]
  const { slug } = useParams()
  const item = journalItems.find(entry => entry.slug === slug)
  usePageMeta(item ? `${item.title} - VoidCube` : 'Conteúdo não encontrado - VoidCube', item?.summary || 'Conteúdo não encontrado.')
  if (!item) return <Navigate to="/blog" replace />
  const related = journalItems.find(entry => entry.slug !== item.slug && entry.category === item.category) || journalItems.find(entry => entry.slug !== item.slug)

  return <article className="article-page">
    <header className="article-hero page-hero">
      <div className="page-hero__label" data-reveal><Link to="/blog">← Voltar ao VOID/LOG</Link><p>{item.category}<br/>{item.date}<br/>{item.read}</p></div>
      <div className="article-hero__copy" data-reveal><h1>{item.title}</h1><p>{item.summary}</p></div>
      {item.type === 'project' && <div className="article-metric" data-reveal><strong>{item.result}</strong><span>{item.metricLabel}</span></div>}
    </header>

    <div className="article-content section-light">
      <aside data-reveal><span>Leitura / {item.read}</span><p>Uma nota direta sobre decisões, limites e resultados observados no trabalho.</p></aside>
      <div className="article-body">
        {item.sections.map(({ title, text }, index) => <section key={title} data-reveal><span>{String(index + 1).padStart(2, '0')}</span><h2>{title}</h2><p>{text}</p></section>)}
        {item.tags && <div className="article-tags" data-reveal>{item.tags.map(tag => <span key={tag}>{tag}</span>)}</div>}
      </div>
    </div>

    {related && <section className="related-entry section-dark">
      <span className="section-index">Continuar lendo</span><h2>{related.title}</h2><Link className="button button--solid" to={`/blog/${related.slug}`}>Abrir conteúdo <ArrowIcon /></Link>
    </section>}
  </article>
}

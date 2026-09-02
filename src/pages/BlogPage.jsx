import React, { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowIcon } from '../components/Icons'
import { journalItems } from '../content/siteContent'
import { usePageMeta } from '../hooks/usePageMeta'

const categories = ['Todos', 'Projetos', 'Arquitetura', 'Automação', 'Integrações']

export default function BlogPage() {
  const [category, setCategory] = useState('Todos')
  const items = useMemo(() => category === 'Todos' ? journalItems : journalItems.filter(item => item.category === category), [category])
  usePageMeta('VOID/LOG — Ideias, sistemas e trabalho real', 'Arquitetura, automação, integrações, projetos e decisões de engenharia da VoidCube.')

  return <div className="blog-page">
    <section className="blog-hero page-hero">
      <div className="page-hero__label" data-reveal><span className="section-index">VOID / LOG</span><p>Notas de campo<br/>desde 2026</p></div>
      <div data-reveal><h1>Ideias para o ponto em que <em>software encontra trabalho real.</em></h1><p>Arquitetura, automação, integrações e decisões tomadas em produção.</p></div>
    </section>

    <section className="blog-index section-light">
      <div className="blog-filters" role="group" aria-label="Filtrar publicações" data-reveal>
        <span>Filtrar por</span>
        {categories.map(item => <button type="button" key={item} className={category === item ? 'is-active' : ''} onClick={() => setCategory(item)} aria-pressed={category === item}>{item}</button>)}
      </div>
      <div className="blog-list" aria-live="polite">
        {items.map((item, index) => <Link className="blog-entry" to={`/blog/${item.slug}`} key={item.slug} data-reveal>
          <span className="blog-entry__number">{String(index + 1).padStart(2, '0')}</span>
          <div className="blog-entry__copy"><small>{item.category} · {item.date}</small><h2>{item.title}</h2><p>{item.summary}</p></div>
          <span className="blog-entry__read">{item.read}</span>
          <ArrowIcon />
        </Link>)}
      </div>
    </section>
  </div>
}

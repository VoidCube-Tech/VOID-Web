import React, { useMemo, useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { journalItems } from '../content/siteContent'
import { usePageMeta } from '../hooks/usePageMeta'

const categories = ['Todos', 'Projetos', 'Arquitetura', 'Automação', 'Integrações']

export default function BlogPage() {
  const [category, setCategory] = useState('Todos')
  const items = useMemo(() => category === 'Todos' ? journalItems : journalItems.filter(item => item.category === category), [category])
  usePageMeta('VoidCube', 'Arquitetura, automação, integrações, projetos e decisões de engenharia da Void Systems.')

  return <div className="inner-page blog-page">
    <section className="inner-hero" data-header-theme="dark"><span className="kicker">VOIDCUBE</span><h1>Ideias, sistemas<br/>e trabalho real.</h1><p>Arquitetura, automação, integrações, projetos e decisões de engenharia.</p><div className="hero-flow-line" aria-hidden="true" /></section>
    <section className="blog-index section" data-header-theme="light">
      <div className="blog-filters" role="group" aria-label="Filtrar publicações">{categories.map(item => <button key={item} className={category === item ? 'active' : ''} onClick={() => setCategory(item)} aria-pressed={category === item}>{item}</button>)}</div>
      <div className="blog-list">{items.map((item, index) => <Link className="blog-list__item" to={`/blog/${item.slug}`} key={item.slug}><span className="blog-list__index">{String(index + 1).padStart(2, '0')}</span><div><span>{item.category} · {item.date}</span><h2>{item.title}</h2><p>{item.summary}</p></div><div><small>{item.read}</small><ArrowRight/></div></Link>)}</div>
    </section>
  </div>
}

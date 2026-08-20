import React from 'react'
import { aboutContent } from '../content/siteContent'
import { SkiperLink } from '../components/skiper/AnimatedLink'
import { usePageMeta } from '../hooks/usePageMeta'

export default function AboutPage() {
  usePageMeta('Sobre — Void Systems', 'Como a Void Systems pensa, trabalha e transforma processos em sistemas confiáveis.')
  return <div className="inner-page about-page">
    <section className="about-hero" data-header-theme="dark"><span className="kicker">{aboutContent.eyebrow}</span><h1>{aboutContent.headline.map(line => <span key={line}>{line}</span>)}</h1><p>{aboutContent.introduction}</p></section>
    <section className="culture-section section" data-header-theme="light"><div><span className="kicker">Cultura em construção</span><p className="manifesto-placeholder">{aboutContent.manifesto}</p></div><div className="culture-principles">{aboutContent.principles.map((principle, index) => <article key={principle.verb}><span>0{index + 1}</span><h2>{principle.verb}</h2><h3>{principle.title}</h3><p>{principle.text}</p></article>)}</div></section>
    <section className="values-section section" data-header-theme="dark"><span className="kicker">Valores</span><div>{aboutContent.values.map((value, index) => <article key={value}><span>0{index + 1}</span><h2>{value}</h2></article>)}</div><SkiperLink href="/contato" variant="line">Conversar sobre um projeto</SkiperLink></section>
  </div>
}

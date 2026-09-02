import React from 'react'
import { Link } from 'react-router-dom'
import { aboutContent } from '../content/siteContent'
import { ArrowIcon } from '../components/Icons'
import { usePageMeta } from '../hooks/usePageMeta'

function TerritoryGraphic() {
  return <svg className="territory-graphic" viewBox="0 0 520 400" fill="none" role="img" aria-label="Mapa esquemático conectando Belém e Ananindeua">
    <path d="M79 286C170 190 285 265 473 190" stroke="#79b7e8" strokeWidth="1.5" strokeOpacity=".72" />
    <circle cx="79" cy="286" r="7" fill="#040a16" stroke="#f4f8ff" />
    <circle cx="473" cy="190" r="7" fill="#040a16" stroke="#1478d4" />
    <text x="79" y="274" fill="#f4f8ff">BELÉM</text><text x="391" y="178" fill="#f4f8ff">ANANINDEUA</text>
  </svg>
}

export default function AboutPage() {
  usePageMeta('Sobre — VoidCube', 'Como a VoidCube transforma processos reais em software confiável, de Belém e Ananindeua para todo o Brasil.')
  return <div className="about-page">
    <section className="about-hero page-hero">
      <div className="page-hero__label" data-reveal><span className="section-index">Sobre / VoidCube</span><p>Belém—Ananindeua<br/>Pará · Brasil</p></div>
      <div className="about-hero__copy" data-reveal><h1>Engenharia começa entendendo <em>o que precisa funcionar.</em></h1><p>{aboutContent.introduction}</p></div>
      <TerritoryGraphic />
    </section>

    <section className="culture-section section-light">
      <header data-reveal><span className="section-index">01 / Como trabalhamos</span><h2>{aboutContent.manifesto}</h2></header>
      <div className="culture-principles">
        {aboutContent.principles.map((principle, index) => <article key={principle.verb} data-reveal><span>{String(index + 1).padStart(2, '0')}</span><b>{principle.verb}</b><h3>{principle.title}</h3><p>{principle.text}</p></article>)}
      </div>
    </section>

    <section className="commitments-section section-dark">
      <header data-reveal><span className="section-index">02 / Compromissos</span><h2>O que permanece quando a tecnologia muda.</h2></header>
      <div className="commitment-list">
        {aboutContent.values.map((value, index) => <article key={value.name} data-reveal><span>{String(index + 1).padStart(2, '0')}</span><h3>{value.name}</h3><p>{value.text}</p></article>)}
      </div>
      <Link className="button button--solid" to="/contato">Conversar sobre um projeto <ArrowIcon /></Link>
    </section>
  </div>
}

import React from 'react'
import { Link } from 'react-router-dom'
import CoreVisual from '../components/CoreVisual'
import { ArrowIcon } from '../components/Icons'
import { usePageMeta } from '../hooks/usePageMeta'
import "../style/notfound.css"

export default function NotFoundPage() {
  usePageMeta('Página não encontrada — VoidCube', 'O endereço informado não existe.')
  return <section className="not-found page-hero">
    <div data-reveal><span className="section-index">Erro / 404</span><h1>Este fluxo não leva a lugar nenhum.</h1><p>O endereço pode ter mudado ou nunca ter existido.</p><Link className="button button--solid" to="/">Voltar ao início <ArrowIcon /></Link></div>
    <CoreVisual compact mode="connect" />
  </section>
}

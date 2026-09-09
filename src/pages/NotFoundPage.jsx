import React, { Suspense, lazy } from 'react'
import { Link } from 'react-router-dom'
import { ArrowIcon } from '../components/Icons'
import { usePageMeta } from '../hooks/usePageMeta'
import '../style/notfound.css'

const BlackHole3D = lazy(() => import('../components/BlackHole3D'))

function HeroModelFallback() {
  return (
    <div
      className="not-found__model-fallback"
      role="img"
      aria-label="Cubo tridimensional VoidCube sobre um campo gravitacional azul"
    >
      <span
        className="not-found__model-fallback-core"
        aria-hidden="true"
      />
    </div>
  )
}

class VisualErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { failed: false }
  }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  componentDidCatch(error) {
    console.warn(
      'A cena 3D não carregou; usando o estado visual estático.',
      error
    )
  }

  render() {
    return this.state.failed
      ? this.props.fallback
      : this.props.children
  }
}

function ThreeDimensionalCore({ className = '' }) {
  return (
    <VisualErrorBoundary fallback={<HeroModelFallback />}>
      <Suspense fallback={<HeroModelFallback />}>
        <BlackHole3D className={className} />
      </Suspense>
    </VisualErrorBoundary>
  )
}

export default function NotFoundPage() {
  usePageMeta(
    'Página não encontrada — VoidCube',
    'O endereço informado não existe.'
  )

  return (
    <section className="not-found page-hero">
      <div
        className="not-found__visual"
        aria-hidden="true"
      >
        <div className="not-found__visual-stage">
          <div className="not-found__model">
            <ThreeDimensionalCore className="black-hole-3d--not-found" />
          </div>
        </div>
      </div>

      <div className="not-found__content" data-reveal>
        <div className="section-intro section-intro--dark">
          <div>
            <span className="section-index">
              Erro / 404
            </span>

            <h2>
              Este fluxo não leva a lugar nenhum.
            </h2>
          </div>

          <p>
            O endereço pode ter mudado ou nunca ter existido.
          </p>
        </div>

        <Link className="button button--solid" to="/">
          Voltar ao início
          <ArrowIcon />
        </Link>
      </div>
    </section>
  )
}
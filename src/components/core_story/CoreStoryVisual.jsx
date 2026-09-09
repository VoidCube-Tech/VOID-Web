import React, { Suspense, lazy } from 'react'

const BlackHole3D = lazy(() => import('../BlackHole3D'))

function HeroModelFallback() {
  return (
    <div
      className="hero-model-fallback"
      role="img"
      aria-label="Cubo tridimensional VoidCube sobre um campo gravitacional azul"
    >
      <span
        className="hero-model-fallback__core"
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
    <VisualErrorBoundary
      fallback={<HeroModelFallback />}
    >
      <Suspense fallback={<HeroModelFallback />}>
        <BlackHole3D className={className} />
      </Suspense>
    </VisualErrorBoundary>
  )
}

export default function CoreStoryVisual() {
  return (
    <div className="core-story__visual">
      <div className="core-story__visual-stage">
        <div className="core-story__model">
          <ThreeDimensionalCore className="black-hole-3d--story" />
        </div>
      </div>
    </div>
  )
}
import React from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ArrowIcon, CapabilityIcon } from '../Icons'

export default function CoreStoryContent({
  heroRef,
  heroSceneRef,
  solutionsRef,
  solutionsSceneRef,
  heroBeat,
  solutionBeat,
  reduceMotion,
}) {
  const { t } = useTranslation('coreStory')

  const capabilities = t('capabilities', {
    returnObjects: true,
  })

  return (
    <>
      <section
        id="inicio"
        ref={heroRef}
        className="home-hero"
        data-header-theme="dark"
        aria-label={t('hero.ariaLabel')}
      >
        <div
          ref={heroSceneRef}
          className="home-hero__scene"
          data-gravity="right"
        >
          <div
            className="hero-copy hero-beat hero-beat--left"
            data-hero-beat="0"
            aria-hidden={heroBeat !== 0}
          >
            <p className="eyebrow">
              <span className="status-dot" />
              {t('hero.eyebrow')}
            </p>

            <h1>
              {t('hero.title.line1')}
              <br />
              {t('hero.title.line2')}{' '}
              <em>{t('hero.title.emphasis')}</em>
            </h1>

            <p className="hero-lede">
              {t('hero.lede')}
            </p>

            <div className="hero-actions">
              <Link
                tabIndex={heroBeat === 0 ? 0 : -1}
                className="button button--solid"
                to="/contato"
              >
                {t('hero.actions.map')}
                <ArrowIcon />
              </Link>

              <Link
                tabIndex={heroBeat === 0 ? 0 : -1}
                className="text-link"
                to="/#projetos"
              >
                {t('hero.actions.projects')}
                <ArrowIcon size={15} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section
        id="solucoes"
        className="solutions-section section-light"
      >
        <header
          className="section-intro"
          data-reveal
        >
          <div>
            <span className="section-index">
              {t('solutions.index')}
            </span>

            <h2>
              {t('solutions.title.line1')}
              <br />
              {t('solutions.title.line2')}
            </h2>
          </div>

          <p>
            {t('solutions.description')}
          </p>
        </header>

        <div
          ref={solutionsRef}
          className="solutions-parallax"
        >
          <div
            ref={solutionsSceneRef}
            className="solutions-parallax__scene"
            data-gravity="right"
          >
            <div className="solutions-parallax__content">
              {Array.isArray(capabilities) &&
                capabilities.map((item, index) => {
                  const modelOnRight = index !== 1

                  return (
                    <article
                      key={item.mode}
                      className={`solution-beat solution-beat--${
                        modelOnRight ? 'left' : 'right'
                      }`}
                      data-solution-beat={index}
                      aria-hidden={
                        reduceMotion
                          ? false
                          : solutionBeat !== index
                      }
                    >
                      <div className="solution-beat__meta">
                        <span>{item.code}</span>

                        <CapabilityIcon
                          type={item.mode}
                        />
                      </div>

                      <h3>{item.title}</h3>

                      <p>{item.text}</p>

                      <footer>
                        <span>{item.detail}</span>
                        <b>{item.signal}</b>
                      </footer>
                    </article>
                  )
                })}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
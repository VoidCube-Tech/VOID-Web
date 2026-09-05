import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowIcon } from '../components/Icons'
import { usePageMeta } from '../hooks/usePageMeta'
import { useTranslation } from 'react-i18next'
import '../style/about.css'

export default function AboutPage() {
    const { t } = useTranslation('about')

    usePageMeta(
        t('meta.title'),
        t('meta.description')
    )

    const principles = t('work.principles', {
        returnObjects: true,
    })

    const outcomes = t('outcomes.items', {
        returnObjects: true,
    })

    const values = t('commitments.values', {
        returnObjects: true,
    })

    return (
        <div className="about-page">
            <section className="about-hero page-hero">
                <div className="page-hero__label" data-reveal>
                    <span className="section-index">
                        {t('hero.index')}
                    </span>

                    <p>
                        {t('hero.location')}
                        <br />
                        {t('hero.scope')}
                    </p>
                </div>

                <div className="about-hero__copy" data-reveal>
                    <h1>
                        {t('hero.titleLine1')}{' '}
                        <em>{t('hero.titleLine2')}</em>
                    </h1>

                    <p>{t('hero.description')}</p>
                </div>
            </section>

            <section className="culture-section section-light">
                <header data-reveal>
                    <span className="section-index">
                        {t('work.index')}
                    </span>

                    <h2>{t('work.title')}</h2>
                </header>

                <div className="culture-principles">
                    {principles.map((principle, index) => (
                        <article
                            key={principle.verb}
                            data-reveal
                        >
                            <span>
                                {String(index + 1).padStart(2, '0')}
                            </span>

                            <b>{principle.verb}</b>
                            <h3>{principle.title}</h3>
                            <p>{principle.text}</p>
                        </article>
                    ))}
                </div>
            </section>

            <section className="outcomes-section section-dark">
                <header data-reveal>
                    <span className="section-index">
                        {t('outcomes.index')}
                    </span>

                    <h2>{t('outcomes.title')}</h2>
                </header>

                <div className="commitment-list">
                    {outcomes.map((outcome, index) => (
                        <article
                            key={outcome.name}
                            data-reveal
                        >
                            <span>
                                {String(index + 1).padStart(2, '0')}
                            </span>

                            <h3>{outcome.name}</h3>
                            <p>{outcome.text}</p>
                        </article>
                    ))}
                </div>
            </section>

            <section className="commitments-section section-light">
                <header data-reveal>
                    <span className="section-index">
                        {t('commitments.index')}
                    </span>

                    <h2>{t('commitments.title')}</h2>
                </header>

                <div className="commitment-list">
                    {values.map((value, index) => (
                        <article
                            key={value.name}
                            data-reveal
                        >
                            <span>
                                {String(index + 1).padStart(2, '0')}
                            </span>

                            <h3>{value.name}</h3>
                            <p>{value.text}</p>
                        </article>
                    ))}
                </div>

                <Link
                    className="button button--solid"
                    to="/contato"
                >
                    {t('commitments.cta')}
                    <ArrowIcon />
                </Link>
            </section>
        </div>
    )
}

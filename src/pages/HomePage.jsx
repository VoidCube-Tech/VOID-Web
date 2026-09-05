import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowIcon } from '../components/Icons'
import { usePageMeta } from '../hooks/usePageMeta'
import { useTranslation } from 'react-i18next'
import '../style/home.css'
import CoreStory from '../components/core_story/CoreStory'

export default function HomePage() {
    const { t } = useTranslation('home')

    const projects = t('projects.items', { returnObjects: true })
    const principles = t('method.principles', { returnObjects: true })
    const journalItems = t('journal.items', { returnObjects: true })

    usePageMeta(
        t('meta.title'),
        t('meta.description')
    )

    return (
        <div className="home-page">
            <CoreStory />

            <section
                id="projetos"
                className="projects-section section-dark"
            >
                <header
                    className="section-intro section-intro--dark"
                    data-reveal
                >
                    <div>
                        <span className="section-index">
                            {t('projects.index')}
                        </span>

                        <h2>
                            {t('projects.titleLine1')}
                            <br />
                            {t('projects.titleLine2')}
                        </h2>
                    </div>

                    <p>{t('projects.description')}</p>
                </header>

                <div className="project-list">
                    {projects.map((project, index) => (
                        <Link
                            className="project-row"
                            to={`/blog/${project.slug}`}
                            key={project.slug}
                            data-reveal
                        >
                            <span className="project-number">
                                {String(index + 1).padStart(2, '0')}
                            </span>

                            <div className="project-copy">
                                <span>{project.sector}</span>
                                <h3>{project.title}</h3>
                                <p>{project.tags.join(' · ')}</p>
                            </div>

                            <div className="project-outcome">
                                <strong>{project.result}</strong>
                                <span>{project.metricLabel}</span>
                            </div>

                            <ArrowIcon className="project-arrow" />
                        </Link>
                    ))}
                </div>
            </section>

            <section className="method-section section-light">
                <div
                    className="method-statement"
                    data-reveal
                >
                    <span className="section-index">
                        {t('method.index')}
                    </span>

                    <h2>
                        {t('method.titleLine1')}
                        <br />
                        <em>{t('method.titleLine2')}</em>
                    </h2>
                </div>

                <div
                    className="method-body"
                    data-reveal
                >
                    <p>{t('method.description')}</p>

                    <Link
                        className="text-link text-link--dark"
                        to="/about"
                    >
                        {t('method.link')}
                        <ArrowIcon size={15} />
                    </Link>
                </div>

                <div className="principle-list">
                    {principles.map((principle, index) => (
                        <article
                            key={principle.verb}
                            data-reveal
                        >
                            <span>
                                {String(index + 1).padStart(2, '0')}
                            </span>

                            <div>
                                <b>{principle.verb}</b>
                                <h3>{principle.title}</h3>
                                <p>{principle.text}</p>
                            </div>
                        </article>
                    ))}
                </div>
            </section>

            <section className="journal-section">
                <div
                    className="journal-heading"
                    data-reveal
                >
                    <span className="section-index">
                        {t('journal.index')}
                    </span>

                    <h2>{t('journal.title')}</h2>

                    <p>{t('journal.description')}</p>

                    <Link
                        className="button button--ink"
                        to="/blog"
                    >
                        {t('journal.link')}
                        <ArrowIcon />
                    </Link>
                </div>

                <div className="journal-list">
                    {journalItems
                        .filter(item => item.type === 'article')
                        .map((post, index) => (
                            <Link
                                className="journal-row"
                                to={`/blog/${post.slug}`}
                                key={post.slug}
                                data-reveal
                            >
                                <span>
                                    {String(index + 1).padStart(2, '0')}
                                </span>

                                <div>
                                    <small>
                                        {post.category} · {post.date}
                                    </small>

                                    <h3>{post.title}</h3>
                                </div>

                                <b>{post.read}</b>

                                <ArrowIcon size={16} />
                            </Link>
                        ))}
                </div>
            </section>

            <section className="final-cta">
                <div data-reveal>
                    <span className="section-index">
                        {t('cta.index')}
                    </span>

                    <h2>{t('cta.title')}</h2>
                </div>

                <div data-reveal>
                    <p>{t('cta.description')}</p>

                    <Link
                        className="button button--solid"
                        to="/contato"
                    >
                        {t('cta.button')}
                        <ArrowIcon />
                    </Link>

                    <small>
                        <span className="status-dot" />
                        {t('cta.note')}
                    </small>
                </div>
            </section>
        </div>
    )
}
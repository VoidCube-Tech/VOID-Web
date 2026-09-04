import React from 'react'
import { useTranslation } from 'react-i18next'
import DecodeText from '../components/DecodeText'
import ContactForm from '../components/ContactForm'
import { usePageMeta } from '../hooks/usePageMeta'
import '../style/contact.css'

export default function ContactPage() {
    const { t } = useTranslation('contact')

    usePageMeta(
        t('meta.title'),
        t('meta.description')
    )

    return (
        <div className="contact-page">
            <section className="contact-intro page-hero">
                <div className="page-hero__label" data-reveal>
                    <span className="section-index">
                        {t('intro.index')}
                    </span>

                    <p>
                        {t('intro.location')}
                        <br />
                        {t('intro.scope')}
                    </p>
                </div>

                <div className="contact-intro__copy" data-reveal>
                    <h1 aria-label={t('intro.title')}>
                        <DecodeText
                            text={t('intro.titleLine1')}
                            delay={100}
                        />{' '}
                        <em>
                            <DecodeText
                                text={t('intro.titleLine2')}
                                delay={360}
                            />
                        </em>
                    </h1>

                    <p>
                        {t('intro.description')}
                    </p>
                </div>
            </section>

            <ContactForm />
        </div>
    )
}

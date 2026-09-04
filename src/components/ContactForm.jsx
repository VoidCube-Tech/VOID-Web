import React, { useRef, useState } from 'react'
import { ArrowIcon, CapabilityIcon } from './Icons'
import { sendContactLead, validateContact } from '../services/contact'
import { useTranslation } from 'react-i18next'

const initialLead = {
    service: '',
    name: '',
    company: '',
    message: '',
}

export default function ContactForm() {
    const { t } = useTranslation('form')
    const services = t('services', { returnObjects: true })

    const formRef = useRef(null)
    const [lead, setLead] = useState(initialLead)
    const [errors, setErrors] = useState({})
    const [status, setStatus] = useState('idle')

    const serviceDescription = errors.service
        ? 'service-hint service-error'
        : 'service-hint'

    const update = event => {
        const { name, value } = event.target

        setLead(current => ({
            ...current,
            [name]: value,
        }))

        setErrors(current => {
            if (!(name in current)) return current

            const nextErrors = { ...current }
            delete nextErrors[name]

            return nextErrors
        })

        if (status !== 'idle' && status !== 'opening_whatsapp') {
            setStatus('idle')
        }
    }

    const submit = async event => {
        event.preventDefault()

        if (status === 'opening_whatsapp') return

        const validation = validateContact(lead)

        if (!validation.valid) {
            setErrors(validation.errors)
            setStatus('error')

            const firstInvalidField = Object.keys(validation.errors)[0]

            requestAnimationFrame(() => {
                const invalidControl =
                    formRef.current?.elements[firstInvalidField]

                const focusTarget =
                    typeof invalidControl?.focus === 'function'
                        ? invalidControl
                        : invalidControl?.[0]

                focusTarget?.focus()
            })

            return
        }

        try {
            setErrors({})
            setStatus('opening_whatsapp')

            await sendContactLead(validation.values)

            setStatus('ready')
        } catch (error) {
            setStatus(
                error.message === 'CONTACT_NOT_CONFIGURED'
                    ? 'not_configured'
                    : 'error'
            )
        }
    }

    return (
        <section className="contact-form-section section-light">
            <aside data-reveal>
                <span className="section-index">
                    {t('section.index')}
                </span>

                <h2 id="contact-context-title">
                    {t('section.titleLine1')}
                    <br />
                    {t('section.titleLine2')}
                </h2>

                <p>
                    {t('section.description')}
                </p>

                <dl
                    className="contact-expectations"
                    aria-label={t('section.expectationsLabel')}
                >
                    <div>
                        <dt>{t('expectations.time.label')}</dt>
                        <dd>{t('expectations.time.value')}</dd>
                    </div>

                    <div>
                        <dt>{t('expectations.destination.label')}</dt>
                        <dd>{t('expectations.destination.value')}</dd>
                    </div>

                    <div>
                        <dt>{t('expectations.privacy.label')}</dt>
                        <dd>{t('expectations.privacy.value')}</dd>
                    </div>
                </dl>
            </aside>

            <form
                ref={formRef}
                className="contact-form"
                onSubmit={submit}
                noValidate
                aria-labelledby="contact-context-title"
            >
                <header className="contact-form__header" data-reveal>
                    <div>
                        <span>{t('header.label')}</span>
                        <strong>{t('header.title')}</strong>
                    </div>

                    <p>{t('header.meta')}</p>
                </header>

                <fieldset
                    className="contact-service"
                    data-reveal
                    aria-describedby={serviceDescription}
                    aria-invalid={Boolean(errors.service)}
                >
                    <legend>
                        <span>01</span>

                        <strong>
                            {t('service.question')}
                        </strong>

                        <i>{t('required')}</i>
                    </legend>

                    <p id="service-hint">
                        {t('service.hint')}
                    </p>

                    <div className="contact-service__options">
                        {services.map(option => (
                            <label
                                className="contact-service-option"
                                key={option.value}
                            >
                                <input
                                    type="radio"
                                    name="service"
                                    value={option.value}
                                    checked={lead.service === option.value}
                                    onChange={update}
                                    required
                                    aria-invalid={Boolean(errors.service)}
                                    aria-describedby={serviceDescription}
                                />

                                <span className="contact-service-option__body">
                                    <span className="contact-service-option__top">
                                        <b>{option.code}</b>

                                        {option.icon ? (
                                            <CapabilityIcon
                                                type={option.icon}
                                            />
                                        ) : (
                                            <i aria-hidden="true">?</i>
                                        )}
                                    </span>

                                    <strong>{option.title}</strong>
                                    <small>{option.detail}</small>
                                </span>
                            </label>
                        ))}
                    </div>

                    {errors.service && (
                        <small
                            className="contact-error"
                            id="service-error"
                        >
                            {errors.service}
                        </small>
                    )}
                </fieldset>

                <div className="contact-fields-grid" data-reveal>
                    <div className="contact-field">
                        <div className="contact-field__label">
                            <span>02</span>
                            <label htmlFor="name">
                                {t('fields.name.label')}
                            </label>
                            <i>{t('required')}</i>
                        </div>

                        <input
                            id="name"
                            name="name"
                            type="text"
                            value={lead.name}
                            onChange={update}
                            autoComplete="name"
                            maxLength="80"
                            placeholder={t('fields.name.placeholder')}
                            required
                            aria-invalid={Boolean(errors.name)}
                            aria-describedby={
                                errors.name ? 'name-error' : undefined
                            }
                        />

                        {errors.name && (
                            <small
                                className="contact-error"
                                id="name-error"
                            >
                                {errors.name}
                            </small>
                        )}
                    </div>

                    <div className="contact-field">
                        <div className="contact-field__label">
                            <span>03</span>
                            <label htmlFor="company">
                                {t('fields.company.label')}
                            </label>
                            <i>{t('required')}</i>
                        </div>

                        <input
                            id="company"
                            name="company"
                            type="text"
                            value={lead.company}
                            onChange={update}
                            autoComplete="organization"
                            maxLength="100"
                            placeholder={t('fields.company.placeholder')}
                            required
                            aria-invalid={Boolean(errors.company)}
                            aria-describedby={
                                errors.company
                                    ? 'company-error'
                                    : undefined
                            }
                        />

                        {errors.company && (
                            <small
                                className="contact-error"
                                id="company-error"
                            >
                                {errors.company}
                            </small>
                        )}
                    </div>
                </div>

                <div
                    className="contact-field contact-field--message"
                    data-reveal
                >
                    <div className="contact-field__label">
                        <span>04</span>

                        <label htmlFor="message">
                            {t('fields.message.label')}
                        </label>

                        <i>{t('optional')}</i>
                    </div>

                    <textarea
                        id="message"
                        name="message"
                        value={lead.message}
                        onChange={update}
                        maxLength="800"
                        rows="5"
                        placeholder={t('fields.message.placeholder')}
                        aria-describedby="message-hint message-count"
                    />

                    <div className="contact-field__meta">
                        <span id="message-hint">
                            {t('fields.message.hint')}
                        </span>

                        <span id="message-count">
                            {lead.message.length}/800
                        </span>
                    </div>
                </div>

                <div className="contact-form__actions" data-reveal>
                    <div>
                        <strong>{t('actions.nextStep.title')}</strong>
                        <p>{t('actions.nextStep.description')}</p>
                    </div>

                    <button
                        className="contact-submit"
                        type="submit"
                        disabled={status === 'opening_whatsapp'}
                    >
                        {status === 'opening_whatsapp' ? (
                            t('actions.submit.loading')
                        ) : (
                            <>
                                {t('actions.submit.label')}
                                <ArrowIcon />
                            </>
                        )}
                    </button>
                </div>

                <div
                    className={`contact-feedback${
                        status === 'error' ||
                        status === 'not_configured'
                            ? ' is-error'
                            : ''
                    }`}
                    aria-live="polite"
                >
                    {status === 'not_configured' &&
                        t('feedback.notConfigured')}

                    {status === 'ready' &&
                        t('feedback.ready')}

                    {status === 'error' &&
                        Object.keys(errors).length > 0 &&
                        t('feedback.validation')}

                    {status === 'error' &&
                        Object.keys(errors).length === 0 &&
                        t('feedback.error')}
                </div>
            </form>
        </section>
    )
}
import React, { useRef, useState } from 'react'
import { ArrowIcon, CapabilityIcon } from '../components/Icons'
import DecodeText from '../components/DecodeText'
import { sendContactLead, validateContact } from '../services/contact'
import { usePageMeta } from '../hooks/usePageMeta'

const initialLead = { service: '', name: '', company: '', message: '' }
const serviceOptions = [
  { value: 'systems', code: 'SYS / 01', title: 'Sistema sob medida', detail: 'ERP, portal ou aplicação interna.', icon: 'system' },
  { value: 'automation', code: 'AUT / 02', title: 'Automação de processos', detail: 'Menos tarefas manuais e retrabalho.', icon: 'automate' },
  { value: 'integrations', code: 'INT / 03', title: 'Integrações confiáveis', detail: 'Sistemas e dados trabalhando juntos.', icon: 'connect' },
  { value: 'discovery', code: 'MAP / 04', title: 'Quero mapear primeiro', detail: 'O problema existe; a solução ainda não.', icon: null },
]

export default function ContactPage() {
  const formRef = useRef(null)
  const [lead, setLead] = useState(initialLead)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle')
  const serviceDescription = errors.service ? 'service-hint service-error' : 'service-hint'
  usePageMeta('Contato — VoidCube', 'Conte o processo que sua equipe precisa organizar. Inicie um projeto com a VoidCube.')

  const update = event => {
    const { name, value } = event.target
    setLead(current => ({ ...current, [name]: value }))
    setErrors(current => {
      if (!(name in current)) return current
      const nextErrors = { ...current }
      delete nextErrors[name]
      return nextErrors
    })
    if (status !== 'idle' && status !== 'opening_whatsapp') setStatus('idle')
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
        const invalidControl = formRef.current?.elements[firstInvalidField]
        const focusTarget = typeof invalidControl?.focus === 'function' ? invalidControl : invalidControl?.[0]
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
      setStatus(error.message === 'CONTACT_NOT_CONFIGURED' ? 'not_configured' : 'error')
    }
  }

  return <div className="contact-page">
    <section className="contact-intro page-hero">
      <div className="page-hero__label" data-reveal><span className="section-index">Contato / 01</span><p>Belém—Ananindeua<br/>Projetos no Brasil</p></div>
      <div className="contact-intro__copy" data-reveal>
        <h1 aria-label="Antes da solução, vamos organizar o problema.">
          <DecodeText text="Antes da solução, vamos organizar" delay={100} />{' '}
          <em><DecodeText text="o problema." delay={360} /></em>
        </h1>
        <p>Conte o contexto. A conversa abre no WhatsApp com a mensagem pronta; o site não armazena seus dados.</p>
      </div>
    </section>

    <section className="contact-form-section section-light">
      <aside data-reveal>
        <span className="section-index">02 / Mapa inicial</span>
        <h2 id="contact-context-title">Um mapa curto.<br/>Sem briefing de gaveta.</h2>
        <p>Escolha a frente mais próxima e conte onde o fluxo perde tempo. A conversa técnica começa a partir daí.</p>
        <dl className="contact-expectations" aria-label="Como funciona">
          <div><dt>Tempo</dt><dd>Cerca de 2 min</dd></div>
          <div><dt>Destino</dt><dd>Seu WhatsApp</dd></div>
          <div><dt>Privacidade</dt><dd>Nada armazenado</dd></div>
        </dl>
      </aside>
      <form ref={formRef} className="contact-form" onSubmit={submit} noValidate aria-labelledby="contact-context-title">
        <header className="contact-form__header" data-reveal>
          <div><span>Diagnóstico inicial</span><strong>Comece pelo que você já sabe.</strong></div>
          <p>04 sinais · 03 obrigatórios</p>
        </header>

        <fieldset className="contact-service" data-reveal aria-describedby={serviceDescription} aria-invalid={Boolean(errors.service)}>
          <legend><span>01</span><strong>Qual frente se aproxima do seu desafio?</strong><i>Obrigatório</i></legend>
          <p id="service-hint">Não precisa acertar a solução agora.</p>
          <div className="contact-service__options">
            {serviceOptions.map(option => <label className="contact-service-option" key={option.value}>
              <input type="radio" name="service" value={option.value} checked={lead.service === option.value} onChange={update} required aria-invalid={Boolean(errors.service)} aria-describedby={serviceDescription} />
              <span className="contact-service-option__body">
                <span className="contact-service-option__top"><b>{option.code}</b>{option.icon ? <CapabilityIcon type={option.icon} /> : <i aria-hidden="true">?</i>}</span>
                <strong>{option.title}</strong>
                <small>{option.detail}</small>
              </span>
            </label>)}
          </div>
          {errors.service && <small className="contact-error" id="service-error">{errors.service}</small>}
        </fieldset>

        <div className="contact-fields-grid" data-reveal>
          <div className="contact-field">
            <div className="contact-field__label"><span>02</span><label htmlFor="name">Seu nome</label><i>Obrigatório</i></div>
            <input id="name" name="name" type="text" value={lead.name} onChange={update} autoComplete="name" maxLength="80" placeholder="Como podemos chamar você?" required aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? 'name-error' : undefined} />
            {errors.name && <small className="contact-error" id="name-error">{errors.name}</small>}
          </div>
          <div className="contact-field">
            <div className="contact-field__label"><span>03</span><label htmlFor="company">Empresa</label><i>Obrigatório</i></div>
            <input id="company" name="company" type="text" value={lead.company} onChange={update} autoComplete="organization" maxLength="100" placeholder="Nome da organização" required aria-invalid={Boolean(errors.company)} aria-describedby={errors.company ? 'company-error' : undefined} />
            {errors.company && <small className="contact-error" id="company-error">{errors.company}</small>}
          </div>
        </div>

        <div className="contact-field contact-field--message" data-reveal>
          <div className="contact-field__label"><span>04</span><label htmlFor="message">Onde o trabalho trava hoje?</label><i>Opcional</i></div>
          <textarea id="message" name="message" value={lead.message} onChange={update} maxLength="800" rows="5" placeholder="Ex.: conciliamos pedidos em planilhas e as exceções dependem de mensagens soltas no WhatsApp." aria-describedby="message-hint message-count" />
          <div className="contact-field__meta"><span id="message-hint">Atalhos, exceções e retrabalho ajudam a localizar o problema.</span><span id="message-count">{lead.message.length}/800</span></div>
        </div>

        <div className="contact-form__actions" data-reveal>
          <div><strong>Próximo passo</strong><p>Você revisa a mensagem antes de enviá-la.</p></div>
          <button className="contact-submit" type="submit" disabled={status === 'opening_whatsapp'}>{status === 'opening_whatsapp' ? 'Abrindo WhatsApp…' : <>Preparar conversa <ArrowIcon /></>}</button>
        </div>
        <div className={`contact-feedback${status === 'error' || status === 'not_configured' ? ' is-error' : ''}`} aria-live="polite">
          {status === 'not_configured' && 'O WhatsApp não está disponível agora. Tente novamente em alguns minutos.'}
          {status === 'ready' && 'Conversa aberta com a mensagem pronta.'}
          {status === 'error' && Object.keys(errors).length > 0 && 'Revise os campos marcados antes de continuar.'}
          {status === 'error' && Object.keys(errors).length === 0 && 'Não foi possível abrir a conversa. Tente novamente.'}
        </div>
      </form>
    </section>
  </div>
}

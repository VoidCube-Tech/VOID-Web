import React, { useState } from 'react'
import { sendContactLead, validateContact } from '../services/contact'
import { usePageMeta } from '../hooks/usePageMeta'

const initialLead = { name: '', phone: '', company: '', message: '' }

export default function ContactPage() {
  const [lead, setLead] = useState(initialLead)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle')
  usePageMeta('Contato — Void Systems', 'Conte o processo que sua equipe precisa organizar. Inicie um projeto com a Void Systems.')

  const update = event => {
    const { name, value } = event.target
    setLead(current => ({ ...current, [name]: value }))
    if (errors[name]) setErrors(current => ({ ...current, [name]: undefined }))
  }
  const submit = async event => {
    event.preventDefault()
    if (status === 'opening_whatsapp') return
    setStatus('validating')
    const validation = validateContact(lead)
    if (!validation.valid) {
      setErrors(validation.errors)
      setStatus('error')
      return
    }
    try {
      setStatus('opening_whatsapp')
      await sendContactLead(validation.values)
      setStatus('ready')
    } catch (error) {
      setStatus(error.message === 'CONTACT_NOT_CONFIGURED' ? 'not_configured' : 'error')
    }
  }

  const fields = [
    { name: 'name', label: 'Seu nome', type: 'text', autoComplete: 'name' },
    { name: 'phone', label: 'Número / WhatsApp', type: 'tel', autoComplete: 'tel' },
    { name: 'company', label: 'Empresa', type: 'text', autoComplete: 'organization' },
  ]

  return <div className="contact-page" data-header-theme="dark"><section className="contact-page__intro"><span className="kicker">Contato / início</span><h1>Antes da solução,<br/>vamos organizar<br/><em>o problema.</em></h1><p>O envio abre uma conversa no WhatsApp com a mensagem pronta. Nada é armazenado pelo site.</p></section>
    <section className="contact-form-wrap"><form className="contact-form" onSubmit={submit} noValidate>{fields.map((field, index) => <div className="contact-field" key={field.name}><span>0{index + 1}</span><label htmlFor={field.name}>{field.label}</label><input id={field.name} name={field.name} type={field.type} value={lead[field.name]} onChange={update} autoComplete={field.autoComplete} maxLength={field.name === 'company' ? 100 : 80} aria-invalid={Boolean(errors[field.name])} aria-describedby={errors[field.name] ? `${field.name}-error` : undefined}/>{errors[field.name] && <small id={`${field.name}-error`}>{errors[field.name]}</small>}</div>)}
      <div className="contact-field contact-field--message"><span>04</span><label htmlFor="message">O que você precisa resolver? <i>Opcional</i></label><textarea id="message" name="message" value={lead.message} onChange={update} maxLength={800}/></div>
      <button className="contact-submit" type="submit" disabled={status === 'opening_whatsapp' || status === 'validating'}>{status === 'opening_whatsapp' ? 'Abrindo WhatsApp…' : 'Enviar projeto ↗'}</button>
      <div className="contact-feedback" aria-live="polite">{status === 'not_configured' && 'Configure VITE_CONTACT_DESTINATION_NUMBER para habilitar o envio.'}{status === 'ready' && 'Conversa aberta com a mensagem pronta.'}</div>
    </form></section>
  </div>
}

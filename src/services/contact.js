export const contactConfig = {
  destinationNumber: (import.meta.env.VITE_CONTACT_DESTINATION_NUMBER || '').replace(/\D/g, ''),
}

export const contactServiceLabels = {
  systems: 'Sistema sob medida',
  automation: 'Automação de processos',
  integrations: 'Integrações confiáveis',
  discovery: 'Mapeamento inicial',
}

export function validateContact(lead) {
  const values = {
    service: contactServiceLabels[lead.service] ? lead.service : '',
    name: lead.name?.trim().slice(0, 80) || '',
    company: lead.company?.trim().slice(0, 100) || '',
    message: lead.message?.trim().slice(0, 800) || '',
  }
  const errors = {}
  if (!values.service) errors.service = 'Escolha uma frente ou marque “Quero mapear primeiro”.'
  if (values.name.length < 2) errors.name = 'Informe seu nome.'
  if (values.company.length < 2) errors.company = 'Informe sua empresa.'
  return { values, errors, valid: Object.keys(errors).length === 0 }
}

export function buildContactMessage(lead) {
  return [
    'NOVO CONTATO — VOIDCUBE', '',
    `Nome: ${lead.name}`,
    `Empresa: ${lead.company}`,
    `Frente: ${contactServiceLabels[lead.service] || 'Mapeamento inicial'}`,
    lead.message ? `Necessidade: ${lead.message}` : null,
    '', 'Origem: Site VOIDCUBE',
  ].filter(line => line !== null).join('\n')
}

export async function sendContactLead(lead) {
  if (!contactConfig.destinationNumber) throw new Error('CONTACT_NOT_CONFIGURED')
  const url = `https://wa.me/${contactConfig.destinationNumber}?text=${encodeURIComponent(buildContactMessage(lead))}`
  window.open(url, '_blank', 'noopener,noreferrer')
  return { mode: 'whatsapp_link', url }
}

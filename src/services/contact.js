export const contactConfig = {
  destinationNumber: (import.meta.env.VITE_CONTACT_DESTINATION_NUMBER || '').replace(/\D/g, ''),
}

export function validateContact(lead) {
  const values = {
    name: lead.name.trim().slice(0, 80),
    phone: lead.phone.trim().slice(0, 30),
    company: lead.company.trim().slice(0, 100),
    message: lead.message?.trim().slice(0, 800) || '',
  }
  const errors = {}
  if (values.name.length < 2) errors.name = 'Informe seu nome.'
  if (values.phone.replace(/\D/g, '').length < 8) errors.phone = 'Informe um número válido.'
  if (values.company.length < 2) errors.company = 'Informe sua empresa.'
  return { values, errors, valid: Object.keys(errors).length === 0 }
}

export function buildContactMessage(lead) {
  return [
    'NOVO CONTATO — VOID/SYSTEMS', '',
    `Nome: ${lead.name}`,
    `Telefone: ${lead.phone}`,
    `Empresa: ${lead.company}`,
    lead.message ? `Necessidade: ${lead.message}` : null,
    '', 'Origem: Site VOID/SYSTEMS',
  ].filter(line => line !== null).join('\n')
}

export async function sendContactLead(lead) {
  if (!contactConfig.destinationNumber) throw new Error('CONTACT_NOT_CONFIGURED')
  const url = `https://wa.me/${contactConfig.destinationNumber}?text=${encodeURIComponent(buildContactMessage(lead))}`
  window.open(url, '_blank', 'noopener,noreferrer')
  return { mode: 'whatsapp_link', url }
}

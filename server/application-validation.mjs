const applicationTypes = new Set(['membership', 'volunteer', 'partnership'])
const fields = {
  fullName: { max: 120, required: true },
  email: { max: 254, required: true },
  phone: { max: 25 },
  organization: { max: 160 },
  area: { max: 120 },
  message: { max: 3000 },
}

function cleanText(value, maxLength) {
  if (typeof value !== 'string') {
    return null
  }
  const trimmed = value.trim()
  return trimmed.length <= maxLength ? trimmed : null
}

export function validateApplication(body) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return { error: 'Please complete the application form and try again.' }
  }
  if (!applicationTypes.has(body.type)) {
    return { error: 'Choose a valid application type.' }
  }
  if (typeof body.website === 'string' && body.website.trim()) {
    return { error: 'The application could not be processed.' }
  }
  if (body.consent !== true) {
    return { error: 'Please agree to the privacy statement before sending your application.' }
  }

  const data = {}
  for (const [field, options] of Object.entries(fields)) {
    const value = cleanText(body[field] ?? '', options.max)
    if (value === null || (options.required && !value)) {
      return { error: `Please check the ${field === 'fullName' ? 'full name' : field} field.` }
    }
    data[field] = value
  }

  data.email = data.email.toLowerCase()
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    return { error: 'Enter a valid email address.' }
  }
  if (data.phone && !/^[+0-9().\s-]{7,25}$/.test(data.phone)) {
    return { error: 'Enter a valid phone number or leave it blank.' }
  }
  if (body.type === 'partnership' && !data.organization) {
    return { error: 'Please provide your organisation name for a partnership application.' }
  }
  return { data }
}

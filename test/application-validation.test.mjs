import test from 'node:test'
import assert from 'node:assert/strict'
import { validateApplication } from '../server/application-validation.mjs'

function validApplication(overrides = {}) {
  return {
    type: 'membership',
    fullName: '  Alex Advocate ',
    email: ' ALEX@example.org ',
    phone: '+27 82 123 4567',
    organization: '',
    area: 'Mamelodi',
    message: 'I would like to join.',
    consent: true,
    ...overrides,
  }
}

test('trims and normalizes valid application details', () => {
  const result = validateApplication(validApplication())

  assert.deepEqual(result.data, {
    fullName: 'Alex Advocate',
    email: 'alex@example.org',
    phone: '+27 82 123 4567',
    organization: '',
    area: 'Mamelodi',
    message: 'I would like to join.',
  })
})

test('requires explicit consent', () => {
  assert.match(validateApplication(validApplication({ consent: false })).error, /agree/)
})

test('requires an organisation for partnerships', () => {
  assert.match(
    validateApplication(validApplication({ type: 'partnership' })).error,
    /organisation/i,
  )
})

test('rejects invalid types, emails, phone numbers, and oversized content', () => {
  assert.match(validateApplication(validApplication({ type: 'other' })).error, /valid application type/)
  assert.match(validateApplication(validApplication({ email: 'not-an-email' })).error, /valid email/)
  assert.match(validateApplication(validApplication({ phone: 'call me' })).error, /valid phone/)
  assert.match(validateApplication(validApplication({ message: 'x'.repeat(3001) })).error, /message/)
})

test('rejects honeypot submissions and non-object request bodies', () => {
  assert.match(validateApplication(validApplication({ website: 'bot' })).error, /could not be processed/)
  assert.match(validateApplication(null).error, /complete the application/)
})

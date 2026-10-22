import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'

export type ApplicationType = 'membership' | 'volunteer' | 'partnership'

type ApplicationFormData = {
  fullName: string
  email: string
  phone: string
  organization: string
  area: string
  message: string
  consent: boolean
  website: string
}

type ApplicationRecord = {
  id: number
  type: ApplicationType
  full_name: string
  email: string
  phone: string
  organization: string
  area: string
  message: string
  created_at: string
}

const apiOrigin = import.meta.env.VITE_API_HOST
  ? `https://${import.meta.env.VITE_API_HOST}`
  : ''

const applicationTypes: { id: ApplicationType; label: string; description: string }[] = [
  {
    id: 'membership',
    label: 'Membership',
    description: 'Join MBA and take part in strengthening our community.',
  },
  {
    id: 'volunteer',
    label: 'Volunteering',
    description: 'Share your time, skills or experience with men and boys.',
  },
  {
    id: 'partnership',
    label: 'Partnership',
    description: 'Explore a collaboration with Men and Boys Advocates.',
  },
]

const emptyForm: ApplicationFormData = {
  fullName: '',
  email: '',
  phone: '',
  organization: '',
  area: '',
  message: '',
  consent: false,
  website: '',
}

function formTitle(type: ApplicationType) {
  return applicationTypes.find((item) => item.id === type)?.label ?? 'Application'
}

export function ApplicationForms({
  activeType,
  onTypeChange,
}: {
  activeType: ApplicationType
  onTypeChange: (type: ApplicationType) => void
}) {
  const [form, setForm] = useState<ApplicationFormData>(emptyForm)
  const [submitting, setSubmitting] = useState(false)
  const [feedback, setFeedback] = useState('')
  const [feedbackKind, setFeedbackKind] = useState<'success' | 'error'>('success')

  const selectType = (type: ApplicationType) => {
    onTypeChange(type)
    setForm(emptyForm)
    setFeedback('')
  }

  const updateField = (field: keyof ApplicationFormData, value: string | boolean) => {
    setForm((current) => ({ ...current, [field]: value }))
  }

  const submitApplication = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmitting(true)
    setFeedback('')

    try {
      const response = await fetch(`${apiOrigin}/api/applications`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, type: activeType }),
      })
      const result: { message?: string; notification?: 'sent' | 'failed' | 'not_configured' } =
        await response.json()

      if (!response.ok) {
        throw new Error(result.message ?? 'Your application could not be sent. Please try again.')
      }

      const notificationMessage = {
        sent: ' MBA has also been notified by email.',
        failed: ' It was saved, but MBA’s email notification failed. Please contact MBA directly.',
        not_configured: ' It was saved; email notifications have not been configured yet.',
      }[result.notification ?? 'not_configured']

      setFeedbackKind('success')
      setFeedback(`Thank you. Your ${formTitle(activeType).toLowerCase()} application was received.${notificationMessage}`)
      setForm(emptyForm)
    } catch (error) {
      setFeedbackKind('error')
      setFeedback(error instanceof Error ? error.message : 'Your application could not be sent.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="application-section section-space" id="application-forms">
      <div className="site-container">
        <div className="section-heading application-heading">
          <div>
            <p className="eyebrow"><span /> TAKE THE NEXT STEP</p>
            <h2>Be part of the change.</h2>
          </div>
          <p>Choose how you would like to get involved. We’ll follow up using the contact details you provide.</p>
        </div>

        <div className="application-layout">
          <div className="application-tabs" role="tablist" aria-label="Choose an application type">
            {applicationTypes.map((item) => (
              <button
                aria-selected={activeType === item.id}
                className={`application-tab${activeType === item.id ? ' is-active' : ''}`}
                aria-controls="application-panel"
                id={`tab-${item.id}`}
                key={item.id}
                onClick={() => selectType(item.id)}
                role="tab"
                type="button"
              >
                <strong>{item.label}</strong>
                <span>{item.description}</span>
              </button>
            ))}
          </div>

          <form
            aria-labelledby={`tab-${activeType}`}
            className="application-form"
            id="application-panel"
            onSubmit={submitApplication}
            role="tabpanel"
          >
            <div className="form-grid">
              <label>
                Full name <span aria-hidden="true">*</span>
                <input
                  autoComplete="name"
                  maxLength={120}
                  onChange={(event) => updateField('fullName', event.target.value)}
                  required
                  value={form.fullName}
                />
              </label>
              <label>
                Email address <span aria-hidden="true">*</span>
                <input
                  autoComplete="email"
                  maxLength={254}
                  onChange={(event) => updateField('email', event.target.value)}
                  required
                  type="email"
                  value={form.email}
                />
              </label>
              <label>
                Phone number
                <input
                  autoComplete="tel"
                  maxLength={25}
                  onChange={(event) => updateField('phone', event.target.value)}
                  type="tel"
                  value={form.phone}
                />
              </label>
              <label>
                {activeType === 'partnership' ? 'Organisation' : 'Organisation (optional)'}
                {activeType === 'partnership' && <span aria-hidden="true"> *</span>}
                <input
                  autoComplete="organization"
                  maxLength={160}
                  onChange={(event) => updateField('organization', event.target.value)}
                  required={activeType === 'partnership'}
                  value={form.organization}
                />
              </label>
              <label className="form-field-wide">
                Area or community
                <input
                  autoComplete="address-level2"
                  maxLength={120}
                  onChange={(event) => updateField('area', event.target.value)}
                  placeholder="For example, Mamelodi"
                  value={form.area}
                />
              </label>
              <label className="form-field-wide">
                {activeType === 'partnership' ? 'Tell us about your organisation and proposed partnership' : 'How would you like to get involved?'}
                <textarea
                  maxLength={3000}
                  onChange={(event) => updateField('message', event.target.value)}
                  rows={5}
                  value={form.message}
                />
              </label>
            </div>

            <label className="honeypot-field" aria-hidden="true">
              Leave this field empty
              <input
                autoComplete="off"
                onChange={(event) => updateField('website', event.target.value)}
                tabIndex={-1}
                value={form.website}
              />
            </label>

            <label className="consent-field">
              <input
                checked={form.consent}
                onChange={(event) => updateField('consent', event.target.checked)}
                required
                type="checkbox"
              />
              <span>
                I agree that Men and Boys Advocates may use these details to review and respond to my application.
                <span aria-hidden="true"> *</span>
              </span>
            </label>
            <p className="privacy-note">
              Please don’t include sensitive health or other private information. Applications are stored for MBA staff to review.
              For privacy questions, contact <a href="mailto:info.112mba@gmail.com">info.112mba@gmail.com</a>.
            </p>

            {feedback && (
              <p className={`form-feedback ${feedbackKind}`} role={feedbackKind === 'error' ? 'alert' : 'status'}>
                {feedback}
              </p>
            )}
            <button className="button button-gold form-submit" disabled={submitting} type="submit">
              {submitting ? 'Sending…' : `Send ${formTitle(activeType).toLowerCase()} application`}
              <span aria-hidden="true">↗</span>
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}

export function AdminPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [applications, setApplications] = useState<ApplicationRecord[]>([])
  const [authenticated, setAuthenticated] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const loadApplications = async () => {
    const response = await fetch(`${apiOrigin}/api/admin/applications`, { credentials: 'include' })
    if (response.status === 401) {
      setAuthenticated(false)
      return
    }
    const result: { applications?: ApplicationRecord[]; message?: string } = await response.json()
    if (!response.ok) {
      throw new Error(result.message ?? 'Could not load applications.')
    }
    setApplications(result.applications ?? [])
    setAuthenticated(true)
  }

  const login = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')
    setLoading(true)
    try {
      const response = await fetch(`${apiOrigin}/api/admin/login`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const result: { message?: string } = await response.json()
      if (!response.ok) {
        throw new Error(result.message ?? 'Sign in failed.')
      }
      setPassword('')
      await loadApplications()
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : 'Sign in failed.')
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    setError('')
    try {
      const response = await fetch(`${apiOrigin}/api/admin/logout`, {
        method: 'POST',
        credentials: 'include',
      })
      if (!response.ok) {
        throw new Error('Sign out failed. Please try again.')
      }
      setAuthenticated(false)
      setApplications([])
    } catch (signOutError) {
      setError(signOutError instanceof Error ? signOutError.message : 'Sign out failed.')
    }
  }

  const deleteApplication = async (id: number) => {
    if (!window.confirm('Permanently delete this application?')) {
      return
    }
    setError('')
    try {
      const response = await fetch(`${apiOrigin}/api/admin/applications/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      })
      const result: { message?: string } = await response.json()
      if (!response.ok) {
        throw new Error(result.message ?? 'Could not delete application.')
      }
      setApplications((current) => current.filter((application) => application.id !== id))
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : 'Could not delete application.')
    }
  }

  return (
    <main className="admin-page section-space">
      <div className="site-container">
        <Link className="admin-back-link" to="/">← Back to the website</Link>
        <p className="eyebrow"><span /> MBA ADMIN</p>
        <h1>Application inbox</h1>
        {error && <p className="form-feedback error" role="alert">{error}</p>}

        {loading ? (
          <p role="status">Loading applications…</p>
        ) : authenticated ? (
          <section className="admin-inbox" aria-label="Submitted applications">
            <div className="admin-inbox-heading">
              <p>{applications.length} application{applications.length === 1 ? '' : 's'}</p>
              <button className="button button-outline-dark" onClick={signOut} type="button">Sign out</button>
            </div>
            {applications.length === 0 ? (
              <p>No applications have been received yet.</p>
            ) : (
              <div className="admin-application-list">
                {applications.map((application) => (
                  <article className="admin-application" key={application.id}>
                    <div className="admin-application-heading">
                      <div>
                        <p className="card-category">{formTitle(application.type)}</p>
                        <h2>{application.full_name}</h2>
                      </div>
                      <time dateTime={application.created_at}>{new Date(application.created_at).toLocaleString()}</time>
                    </div>
                    <p>
                      <a href={`mailto:${application.email}`}>{application.email}</a>
                      {application.phone && <> · <a href={`tel:${application.phone}`}>{application.phone}</a></>}
                    </p>
                    {application.organization && <p><strong>Organisation:</strong> {application.organization}</p>}
                    {application.area && <p><strong>Area:</strong> {application.area}</p>}
                    {application.message && <p className="admin-application-message">{application.message}</p>}
                    <button
                      className="admin-delete-button"
                      onClick={() => deleteApplication(application.id)}
                      type="button"
                    >
                      Delete application
                    </button>
                  </article>
                ))}
              </div>
            )}
          </section>
        ) : (
          <form className="admin-login-form" onSubmit={login}>
            <p>Sign in with the admin email and password configured for the Render service.</p>
            <label>
              Admin email
              <input
                autoComplete="username"
                onChange={(event) => setEmail(event.target.value)}
                required
                type="email"
                value={email}
              />
            </label>
            <label>
              Password
              <input
                autoComplete="current-password"
                maxLength={200}
                onChange={(event) => setPassword(event.target.value)}
                required
                type="password"
                value={password}
              />
            </label>
            <button className="button button-gold" disabled={loading} type="submit">
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>
        )}
      </div>
    </main>
  )
}

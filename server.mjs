import { timingSafeEqual } from 'node:crypto'
import express from 'express'
import session from 'express-session'
import connectPgSimple from 'connect-pg-simple'
import { rateLimit } from 'express-rate-limit'
import helmet from 'helmet'
import nodemailer from 'nodemailer'
import pg from 'pg'
import { validateApplication } from './server/application-validation.mjs'

const { Pool } = pg
const port = Number(process.env.PORT ?? 3001)
const requiredEnvironment = ['DATABASE_URL', 'SESSION_SECRET', 'ADMIN_EMAIL', 'ADMIN_PASSWORD']
const missingEnvironment = requiredEnvironment.filter((key) => !process.env[key])

if (missingEnvironment.length > 0) {
  throw new Error(`Missing required environment variables: ${missingEnvironment.join(', ')}`)
}
if (process.env.SESSION_SECRET.length < 32) {
  throw new Error('SESSION_SECRET must contain at least 32 characters.')
}
if (process.env.ADMIN_PASSWORD.length < 12) {
  throw new Error('ADMIN_PASSWORD must contain at least 12 characters.')
}

const smtpValues = ['SMTP_HOST', 'SMTP_USER', 'SMTP_PASSWORD']
const configuredSmtpValues = smtpValues.filter((key) => process.env[key])
if (configuredSmtpValues.length > 0 && configuredSmtpValues.length !== smtpValues.length) {
  throw new Error(`Configure all or none of these email settings: ${smtpValues.join(', ')}`)
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  connectionTimeoutMillis: 10000,
  max: 5,
})
const app = express()
const PgSession = connectPgSimple(session)
const frontendHost = process.env.FRONTEND_HOST
const frontendOrigin = frontendHost
  ? (frontendHost.startsWith('http') ? frontendHost : `https://${frontendHost}`)
  : ''
const allowedOrigins = new Set([frontendOrigin].filter(Boolean))
if (process.env.NODE_ENV !== 'production') {
  allowedOrigins.add('http://localhost:5173')
  allowedOrigins.add('http://127.0.0.1:5173')
}
const emailEnabled = configuredSmtpValues.length === smtpValues.length
const smtpPort = Number(process.env.SMTP_PORT ?? 587)
if (emailEnabled && (!Number.isInteger(smtpPort) || smtpPort < 1 || smtpPort > 65535)) {
  throw new Error('SMTP_PORT must be a valid TCP port number.')
}
const mailer = emailEnabled
  ? nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD },
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 20000,
    })
  : null

app.set('trust proxy', 1)
app.use(helmet({ contentSecurityPolicy: false }))
app.use((request, response, next) => {
  const origin = request.get('origin')
  if (origin && allowedOrigins.has(origin)) {
    response.setHeader('Access-Control-Allow-Origin', origin)
    response.setHeader('Access-Control-Allow-Credentials', 'true')
    response.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS')
    response.setHeader('Access-Control-Allow-Headers', 'Content-Type')
    response.setHeader('Vary', 'Origin')
  }

  if (request.method === 'OPTIONS') {
    return response.sendStatus(204)
  }
  next()
})
app.use(express.json({ limit: '12kb' }))
app.use(session({
  name: 'mba_admin',
  store: new PgSession({ pool, tableName: 'admin_sessions', createTableIfMissing: true }),
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    maxAge: 8 * 60 * 60 * 1000,
    path: '/',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    secure: process.env.NODE_ENV === 'production',
  },
}))

const applicationLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  handler: (_request, response) => response.status(429).json({ message: 'Too many applications from this connection. Please try again later.' }),
})
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  handler: (_request, response) => response.status(429).json({ message: 'Too many sign-in attempts. Please try again later.' }),
})

function sameOriginRequired(request, response, next) {
  const origin = request.get('origin')
  if (origin && !allowedOrigins.has(origin)) {
    return response.status(403).json({ message: 'This request origin is not allowed.' })
  }
  next()
}

function requireAdmin(request, response, next) {
  if (request.session.adminAuthenticated !== true) {
    return response.status(401).json({ message: 'Please sign in to view applications.' })
  }
  next()
}

function secureEquals(actual, expected) {
  const actualBuffer = Buffer.from(actual)
  const expectedBuffer = Buffer.from(expected)
  if (actualBuffer.length !== expectedBuffer.length) {
    timingSafeEqual(actualBuffer, Buffer.alloc(actualBuffer.length))
    return false
  }
  return timingSafeEqual(actualBuffer, expectedBuffer)
}

app.get('/api/health', async (_request, response) => {
  try {
    await pool.query('SELECT 1')
    response.json({ status: 'ok' })
  } catch (error) {
    console.error('Database health check failed:', error.message)
    response.status(503).json({ status: 'unavailable' })
  }
})

app.post('/api/applications', applicationLimiter, sameOriginRequired, async (request, response) => {
  const validation = validateApplication(request.body)
  if (validation.error) {
    return response.status(400).json({ message: validation.error })
  }

  const { data } = validation
  try {
    const result = await pool.query(
      `INSERT INTO applications (type, full_name, email, phone, organization, area, message)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id, created_at`,
      [
        request.body.type,
        data.fullName,
        data.email,
        data.phone,
        data.organization,
        data.area,
        data.message,
      ],
    )
    const application = result.rows[0]
    let notification = 'not_configured'

    if (mailer) {
      try {
        await mailer.sendMail({
          from: process.env.SMTP_FROM || process.env.SMTP_USER,
          to: process.env.MAIL_TO || 'info.112mba@gmail.com',
          replyTo: data.email,
          subject: `New ${request.body.type} application`,
          text: [
            `Application type: ${request.body.type}`,
            `Name: ${data.fullName}`,
            `Email: ${data.email}`,
            `Phone: ${data.phone || 'Not provided'}`,
            `Organisation: ${data.organization || 'Not provided'}`,
            `Area: ${data.area || 'Not provided'}`,
            '',
            'Message:',
            data.message || 'No message provided',
          ].join('\n'),
        })
        notification = 'sent'
      } catch (error) {
        notification = 'failed'
        console.error(`Email notification failed for application ${application.id}:`, error.message)
      }
    }

    response.status(201).json({
      message: 'Application received.',
      notification,
    })
  } catch (error) {
    console.error('Application could not be saved:', error.message)
    response.status(500).json({ message: 'Your application could not be saved. Please try again later.' })
  }
})

app.post('/api/admin/login', loginLimiter, sameOriginRequired, (request, response, next) => {
  const email = typeof request.body?.email === 'string' ? request.body.email.trim().toLowerCase() : ''
  const password = typeof request.body?.password === 'string' ? request.body.password : ''
  const validEmail = secureEquals(email, process.env.ADMIN_EMAIL.trim().toLowerCase())
  const validPassword = secureEquals(password, process.env.ADMIN_PASSWORD)

  if (!validEmail || !validPassword) {
    return response.status(401).json({ message: 'The email or password is incorrect.' })
  }

  request.session.regenerate((error) => {
    if (error) {
      return next(error)
    }
    request.session.adminAuthenticated = true
    response.json({ message: 'Signed in.' })
  })
})

app.post('/api/admin/logout', sameOriginRequired, requireAdmin, (request, response, next) => {
  request.session.destroy((error) => {
    if (error) {
      return next(error)
    }
    response.clearCookie('mba_admin', { path: '/' })
    response.json({ message: 'Signed out.' })
  })
})

app.get('/api/admin/applications', requireAdmin, async (_request, response) => {
  try {
    const result = await pool.query(
      `SELECT id, type, full_name, email, phone, organization, area, message, created_at
       FROM applications
       ORDER BY created_at DESC
       LIMIT 250`,
    )
    response.json({ applications: result.rows })
  } catch (error) {
    console.error('Applications could not be loaded:', error.message)
    response.status(500).json({ message: 'Applications could not be loaded. Please try again.' })
  }
})

app.delete('/api/admin/applications/:id', sameOriginRequired, requireAdmin, async (request, response) => {
  if (!/^[1-9]\d*$/.test(request.params.id)) {
    return response.status(400).json({ message: 'Choose a valid application.' })
  }
  try {
    const result = await pool.query('DELETE FROM applications WHERE id = $1 RETURNING id', [request.params.id])
    if (result.rowCount === 0) {
      return response.status(404).json({ message: 'Application not found.' })
    }
    response.json({ message: 'Application deleted.' })
  } catch (error) {
    console.error('Application could not be deleted:', error.message)
    response.status(500).json({ message: 'Application could not be deleted. Please try again.' })
  }
})

app.use((error, _request, response, _next) => {
  if (error instanceof SyntaxError && 'body' in error) {
    return response.status(400).json({ message: 'The request body must be valid JSON.' })
  }
  console.error('Unhandled API error:', error.message)
  response.status(500).json({ message: 'The request could not be completed. Please try again.' })
})

async function start() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS applications (
      id BIGSERIAL PRIMARY KEY,
      type TEXT NOT NULL CHECK (type IN ('membership', 'volunteer', 'partnership')),
      full_name VARCHAR(120) NOT NULL,
      email VARCHAR(254) NOT NULL,
      phone VARCHAR(25) NOT NULL DEFAULT '',
      organization VARCHAR(160) NOT NULL DEFAULT '',
      area VARCHAR(120) NOT NULL DEFAULT '',
      message VARCHAR(3000) NOT NULL DEFAULT '',
      consented_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `)
  await pool.query('CREATE INDEX IF NOT EXISTS applications_created_at_idx ON applications (created_at DESC)')

  app.listen(port, '0.0.0.0', () => {
    console.log(`MBA application API listening on port ${port}`)
    if (!emailEnabled) {
      console.warn('SMTP is not configured; applications will be saved but email notifications are disabled.')
    }
  })
}

start().catch((error) => {
  console.error('MBA application API failed to start:', error.message)
  process.exitCode = 1
})

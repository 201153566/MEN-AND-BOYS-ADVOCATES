import { useState } from 'react'
import { Link, Route, Routes } from 'react-router-dom'
import { AdminPage, ApplicationForms, type ApplicationType } from './Applications'
import './App.css'

const currentYear = new Date().getFullYear()

const programmes = [
  {
    number: '01',
    title: 'Men and boys mentorship',
    image: '/images/mba-mentorship.png',
    imageAlt: 'A mentor talking with young men outdoors',
    description:
      'Create supportive spaces where boys and young men can learn, ask questions and grow with positive role models.',
    category: 'MENTORSHIP',
    icon: '↗',
  },
  {
    number: '02',
    title: 'Positive masculinity',
    image: 'https://images.unsplash.com/photo-1509099836639-18ba1795216d?auto=format&fit=crop&w=900&q=80',
    imageAlt: 'A group of African children spending time together outdoors',
    description:
      'Encourage respect, responsible fatherhood, emotional wellbeing and positive relationships.',
    category: 'DIALOGUE',
    icon: '✳',
  },
  {
    number: '03',
    title: 'Health and wellbeing',
    image: 'https://images.unsplash.com/photo-1562173650-f61426fbe683?auto=format&fit=crop&w=900&q=80',
    imageAlt: 'A young Black man outdoors',
    description:
      'Promote health awareness, HIV prevention education and healthy choices for men and boys.',
    category: 'HEALTH',
    icon: '♡',
  },
  {
    number: '04',
    title: 'Safer communities',
    image: 'https://images.unsplash.com/photo-1620464225966-8482645f2db1?auto=format&fit=crop&w=900&q=80',
    imageAlt: 'Men taking part in a community activity outdoors in South Africa',
    description:
      'Support gender equality and community action to prevent gender-based violence and substance abuse.',
    category: 'COMMUNITY',
    icon: '⌂',
  },
]

function BrandMark() {
  return (
    <span className="brand-mark" aria-hidden="true">
      <svg viewBox="0 0 48 48" fill="none">
        <path d="M24 37V20m0 7c-7 0-11-4-11-10 7 0 11 4 11 10Zm0-5c0-7 4-11 11-11 0 7-4 11-11 11Z" />
        <path d="M12 38h24" />
      </svg>
      <span>MBA</span>
    </span>
  )
}

function HomePage() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [applicationType, setApplicationType] = useState<ApplicationType>('membership')

  const closeMenu = () => setMenuOpen(false)

  return (
    <>
      <div className="topline">
        <div className="site-container topline-inner">
          <span>Rooted in Mamelodi. Growing stronger together.</span>
          <a href="tel:+27836272335">Call us: 083 627 2335</a>
        </div>
      </div>

      <header className="site-header">
        <div className="site-container header-inner">
          <a className="brand" href="#home" onClick={closeMenu} aria-label="MBA home">
            <BrandMark />
            <span className="brand-copy">
              <strong>MEN AND BOYS</strong>
              <span>ADVOCATES</span>
            </span>
          </a>

          <button
            className="menu-toggle"
            type="button"
            aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={menuOpen}
            aria-controls="primary-navigation"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <span />
            <span />
          </button>

          <nav
            className={`primary-navigation${menuOpen ? ' is-open' : ''}`}
            id="primary-navigation"
            aria-label="Main navigation"
          >
            <a href="#who-we-are" onClick={closeMenu}>Who we are</a>
            <a href="#programmes" onClick={closeMenu}>Programmes</a>
            <a href="#events" onClick={closeMenu}>Events</a>
            <a href="#contact" onClick={closeMenu}>Contact</a>
            <a className="button button-small" href="#join" onClick={closeMenu}>Join MBA <span aria-hidden="true">↗</span></a>
          </nav>
        </div>
      </header>

      <main>
        <section className="hero" id="home" aria-labelledby="hero-title">
          <img
            className="hero-image"
            src="/images/mba-mentorship.png"
            alt="A Black man speaking with two young men outdoors during a community conversation."
          />
          <div className="hero-overlay" />
          <div className="site-container hero-content">
            <p className="eyebrow eyebrow-light"><span /> COMMUNITY. CARE. CHANGE.</p>
            <h1 id="hero-title">Building better men.<br />Empowering boys.</h1>
            <p className="hero-subtitle">Strengthening communities.</p>
            <p className="hero-description">
              We believe every boy deserves the guidance, encouragement and opportunity to
              become the best version of himself.
            </p>
            <div className="hero-actions">
              <a className="button button-gold" href="#join">Become a member <span aria-hidden="true">↗</span></a>
              <a className="text-link text-link-light" href="#programmes">Discover our work <span aria-hidden="true">→</span></a>
            </div>
          </div>
          <div className="hero-note"><span>✳</span> A community initiative in Mamelodi, Tshwane</div>
          <div className="hero-caption">Mentorship begins with a conversation.</div>
        </section>

        <div className="trust-strip" aria-label="Our guiding principles">
          <div className="site-container trust-inner">
            <span>Guided by</span>
            <strong>RESPECT</strong><i />
            <strong>MENTORSHIP</strong><i />
            <strong>NON-VIOLENCE</strong><i />
            <strong>COMMUNITY</strong>
          </div>
        </div>

        <section className="intro-section section-space" id="who-we-are">
          <div className="site-container intro-grid">
            <div className="intro-heading">
              <p className="eyebrow"><span /> WHO WE ARE</p>
              <h2>Good men help<br />build a better future.</h2>
              <a className="text-link" href="#join">Get to know us <span aria-hidden="true">→</span></a>
            </div>
            <div className="intro-copy">
              <p className="lead">
                Men and Boys Advocates (MBA) is a community-based organisation in Mamelodi,
                Pretoria, working to promote positive masculinity and support the next generation.
              </p>
              <p>
                Previously known as the Mamelodi Men&apos;s Forum, we are growing our focus to
                include boys and young people. We bring people together around mentorship,
                health, education, equality and safer communities.
              </p>
              <div className="intro-callout">
                <span className="callout-mark" aria-hidden="true">“</span>
                <p>Every conversation is a chance to lead with care, respect and purpose.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="programmes-section section-space" id="programmes">
          <div className="site-container">
            <div className="section-heading">
              <div>
                <p className="eyebrow"><span /> WHAT WE FOCUS ON</p>
                <h2>Small steps. Lasting change.</h2>
              </div>
              <p>We work alongside our community to create opportunities for men and boys to thrive.</p>
            </div>
            <div className="programme-grid">
              {programmes.map((programme) => (
                <article className="programme-card" key={programme.number}>
                  <img
                    className="programme-image"
                    src={programme.image}
                    alt={programme.imageAlt}
                    loading="lazy"
                  />
                  <div className="programme-card-content">
                    <div className="programme-card-top">
                      <span className="programme-icon" aria-hidden="true">{programme.icon}</span>
                      <span className="programme-number">{programme.number}</span>
                    </div>
                    <p className="card-category">{programme.category}</p>
                    <h3>{programme.title}</h3>
                    <p className="programme-description">{programme.description}</p>
                  </div>
                  <a className="card-arrow" href="#join" aria-label={`Get involved with ${programme.title}`}>
                    <span aria-hidden="true">↗</span>
                  </a>
                </article>
              ))}
            </div>
            <p className="programme-note">
              Our focus also includes education, leadership, life skills, entrepreneurship and food security.
            </p>
          </div>
        </section>

        <section className="why-section">
          <div className="why-image-wrap">
            <img
              src="https://images.unsplash.com/photo-1509099836639-18ba1795216d?auto=format&fit=crop&w=1100&q=80"
              alt="Young people learning together; illustrative photography"
              loading="lazy"
            />
            <span className="photo-label">A brighter future starts with us</span>
          </div>
          <div className="why-content">
            <p className="eyebrow eyebrow-light"><span /> THE POWER OF MENTORSHIP</p>
            <h2>Show up.<br />Listen. Guide.</h2>
            <p>
              A trusted mentor can help a young person feel seen, build confidence and imagine
              new possibilities. We want to make those positive connections stronger in our community.
            </p>
            <a className="button button-outline-light" href="#volunteer">Volunteer with us <span aria-hidden="true">↗</span></a>
            <span className="why-decoration" aria-hidden="true">MBA</span>
          </div>
        </section>

        <section className="events-section section-space" id="events">
          <div className="site-container">
            <div className="section-heading events-heading">
              <div>
                <p className="eyebrow"><span /> GATHER, LEARN, TAKE ACTION</p>
                <h2>Community events</h2>
              </div>
              <p>Event information below is sample content and must be verified before being treated as confirmed.</p>
            </div>
            <div className="events-grid">
              <article className="event-card">
                <div className="event-date"><strong>23</strong><span>JUL 2026</span></div>
                <div className="event-details">
                  <span className="event-status status-past">Sample · past date</span>
                  <h3>Men’s Health Awareness Day</h3>
                  <p>Moretele Park, Mamelodi West</p>
                  <span className="event-meta">Time and partner details to be confirmed</span>
                </div>
                <span className="event-decoration" aria-hidden="true">01</span>
              </article>
              <article className="event-card event-card-featured">
                <div className="event-date event-date-gold"><strong>13</strong><span>NOV 2026</span></div>
                <div className="event-details">
                  <span className="event-status status-upcoming">Sample · details TBC</span>
                  <h3>Tshwane Men’s Action Committee</h3>
                  <p>Tshwane House</p>
                  <span className="event-meta">Time and further details to be confirmed</span>
                </div>
                <span className="event-decoration" aria-hidden="true">02</span>
              </article>
              <article className="event-card event-card-featured">
                <div className="event-date event-date-gold"><strong>19</strong><span>NOV 2026</span></div>
                <div className="event-details">
                  <span className="event-status status-upcoming">Upcoming · details TBC</span>
                  <h3>International Men’s Day Community Event</h3>
                  <p>Community venue to be confirmed</p>
                  <span className="event-meta">Time and event details to be confirmed</span>
                </div>
                <span className="event-decoration" aria-hidden="true">03</span>
              </article>
            </div>
            <p className="events-footnote">These are editable sample event records, not verified event announcements.</p>
          </div>
        </section>

        <section className="join-section" id="join">
          <div className="site-container join-inner">
            <div>
              <p className="eyebrow eyebrow-light"><span /> THERE IS A PLACE FOR YOU</p>
              <h2>Be part of the change.</h2>
              <p>Bring your time, experience or ideas. Together, we can help build a community where every young person can thrive.</p>
            </div>
            <div className="join-actions">
              <a className="button button-gold" href="#application-forms" onClick={() => setApplicationType('membership')}>Become a member <span aria-hidden="true">↗</span></a>
              <a className="button button-outline-light" href="#application-forms" id="volunteer" onClick={() => setApplicationType('volunteer')}>Volunteer with us</a>
              <a className="button button-outline-light" href="#application-forms" id="partners" onClick={() => setApplicationType('partnership')}>Partner with us</a>
            </div>
          </div>
        </section>

        <ApplicationForms activeType={applicationType} onTypeChange={setApplicationType} />
      </main>

      <footer className="site-footer" id="contact">
        <div className="site-container footer-main">
          <div className="footer-about">
            <a className="brand footer-brand" href="#home">
              <BrandMark />
              <span className="brand-copy"><strong>MEN AND BOYS</strong><span>ADVOCATES</span></span>
            </a>
            <p>Building Better Men. Empowering Boys. Strengthening Communities.</p>
          </div>
          <div className="footer-column">
            <h2>Get in touch</h2>
            <a href="tel:+27836272335">083 627 2335</a>
            <a href="mailto:info.112mba@gmail.com">info.112mba@gmail.com</a>
            <span>Mamelodi, Pretoria, Gauteng</span>
          </div>
          <div className="footer-column">
            <h2>Find your way</h2>
            <a href="#who-we-are">Who we are</a>
            <a href="#programmes">Our focus</a>
            <a href="#events">Events</a>
          </div>
          <div className="footer-column">
            <h2>Follow our journey</h2>
            <span>Social media links to be confirmed</span>
            <span>Physical address to be updated</span>
          </div>
        </div>
        <div className="site-container footer-bottom">
          <span>© {currentYear} Men and Boys Advocates</span>
          <Link to="/admin">Admin sign in</Link>
        </div>
      </footer>
    </>
  )
}

function NotFoundPage() {
  return (
    <main className="not-found">
      <BrandMark />
      <p className="eyebrow">PAGE NOT FOUND</p>
      <h1>Let’s get you back on track.</h1>
      <Link className="button button-gold" to="/">Return to home</Link>
    </main>
  )
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/admin" element={<AdminPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

export default App

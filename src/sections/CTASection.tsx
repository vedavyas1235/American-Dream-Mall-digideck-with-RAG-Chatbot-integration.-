import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useDeckSafe } from '../components/Deck/DeckEngine'
import './CTASection.css'

type FormType = 'leasing' | 'sponsorship' | 'events'

const PATHS: { id: FormType; title: string; sub: string; icon: string }[] = [
  {
    id: 'leasing',
    title: 'Leasing Opportunities',
    sub: 'Luxury · Flagship · Pop-Up · F&B',
    icon: '🏢',
  },
  {
    id: 'sponsorship',
    title: 'Brand Partnerships',
    sub: 'Sponsorship · Activation · Co-Marketing',
    icon: '🤝',
  },
  {
    id: 'events',
    title: 'Event Bookings',
    sub: 'Concerts · Corporate · Galas · Launches',
    icon: '🎯',
  },
]

export default function CTASection() {
  const deck = useDeckSafe()
  const persona = deck?.persona ?? null
  const [active, setActive] = useState<FormType>('leasing')
  const [submitted, setSubmitted] = useState(false)
  const [inView, setInView] = useState(false)
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true) },
      { threshold: 0.1 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  const openChat = () => {
    window.dispatchEvent(new CustomEvent('deck:open-chat'))
  }

  return (
    <section id="cta" className="cta-section" ref={ref}>

      {/* Bottom-right buttons:
          - Persona active: [Ask AI] [3D Map →] pair
          - Linear deck (no persona): solo 3D Map button (unchanged) */}
      {deck && (
        persona ? (
          <div className="cta-bottom-pair">
            <button
              className="cta-ask-ai-btn"
              onClick={openChat}
              title="Ask our AI assistant"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
              Ask AI
            </button>
            <button
              onClick={() => deck.goToSlideById('mall-3d')}
              className="cta-3d-btn"
              title="Explore Interactive 3D Floor Map"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
              </svg>
              3D Map
            </button>
          </div>
        ) : (
          <button
            onClick={() => deck.goToSlideById('mall-3d')}
            className="cta-3d-btn"
            title="Explore Interactive 3D Floor Map"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
            </svg>
            3D Map
          </button>
        )
      )}
      {/* Background — same aerial mall video as Catchment section */}
      <div className="cta-section__bg">
        <video
          src="/assets/videos/american_dream_intro.mp4"
          autoPlay
          muted
          loop
          playsInline
          style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scale(1.1)', transformOrigin: 'center center' }}
        />
        <div className="cta-section__bg-overlay" />
      </div>

      <div className="cta-section__inner">
        {/* Header + Body side by side */}
        <motion.div
          className="cta-top-row"
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Left: Header */}
          <div className="cta-section__header">
            <span className="section-label">Take the Next Step</span>
            <h2 className="cta-section__title">
              Your Audience is<br />
              <em>Already Here.</em>
            </h2>
            <div className="gold-line" />
            <p className="cta-section__desc">
              40 million people walk through these doors every year.
              The only question is: are you here when they do?
            </p>

            {/* Path cards — compact */}
            <div className="cta-paths">
              {PATHS.map(path => (
                <button
                  key={path.id}
                  className={`cta-path ${active === path.id ? 'cta-path--active' : ''}`}
                  onClick={() => { setActive(path.id); setSubmitted(false) }}
                >
                  <span className="cta-path__icon">{path.icon}</span>
                  <div>
                    <span className="cta-path__title">{path.title}</span>
                    <span className="cta-path__sub">{path.sub}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Right: Form */}
          <div className="cta-form-wrap">
            {!submitted ? (
              <form className="cta-form" onSubmit={handleSubmit}>
                <div className="cta-form__label">
                  Inquiring about: <strong>{PATHS.find(p => p.id === active)?.title}</strong>
                </div>

                <div className="cta-form__row">
                  <div className="cta-field">
                    <label htmlFor="cta-name">Full Name</label>
                    <input id="cta-name" type="text" required placeholder="Jane Smith" />
                  </div>
                  <div className="cta-field">
                    <label htmlFor="cta-company">Company / Brand</label>
                    <input id="cta-company" type="text" required placeholder="Company Inc." />
                  </div>
                </div>

                <div className="cta-form__row">
                  <div className="cta-field">
                    <label htmlFor="cta-email">Business Email</label>
                    <input id="cta-email" type="email" required placeholder="jane@company.com" />
                  </div>
                  <div className="cta-field">
                    <label htmlFor="cta-phone">Phone Number</label>
                    <input id="cta-phone" type="tel" placeholder="+1 (555) 000-0000" />
                  </div>
                </div>

                <div className="cta-field">
                  <label htmlFor="cta-message">Tell Us About Your Vision</label>
                  <textarea
                    id="cta-message"
                    rows={3}
                    placeholder={
                      active === 'leasing'
                        ? 'E.g. We are looking for a 3,000 sq ft flagship in the luxury wing...'
                        : active === 'sponsorship'
                        ? 'E.g. We want to activate a 2-week brand experience...'
                        : 'E.g. We are planning a 500-person gala for Q4...'
                    }
                  />
                </div>

                <button className="cta-form__submit" type="submit">
                  Submit Inquiry →
                </button>
              </form>
            ) : (
              <div className="cta-success">
                <div className="cta-success__icon">✓</div>
                <h3>Thank You</h3>
                <p>
                  Our commercial team will be in touch within 24 hours to discuss your{' '}
                  {PATHS.find(p => p.id === active)?.title.toLowerCase()} inquiry.
                </p>
                <button className="cta-success__reset" onClick={() => setSubmitted(false)}>
                  Submit Another Inquiry
                </button>
              </div>
            )}
          </div>
        </motion.div>

        {/* Footer strip */}
        <motion.div
          className="cta-section__footer"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 1, delay: 0.4 }}
        >
          <div className="cta-footer-info">
            <span className="cta-footer-label">Address</span>
            <span>1 American Dream Way, East Rutherford, NJ 07073</span>
          </div>
          <div className="cta-footer-info">
            <span className="cta-footer-label">Commercial Leasing</span>
            <span>leasing@americandream.com</span>
          </div>
          <div className="cta-footer-info">
            <span className="cta-footer-label">Partnerships & Events</span>
            <span>partnerships@americandream.com</span>
          </div>
          <div className="cta-footer-credit">
            <span className="cta-footer-brand">AMERICAN DREAM</span>
            <span className="cta-footer-sub">East Rutherford, NJ · Est. 2019</span>
          </div>
          {/* 3D Mall Explorer link removed from footer — now fixed bottom-right */}
        </motion.div>
      </div>
    </section>
  )
}

import { motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { useDeck } from '../components/Deck/DeckEngine'
import './PartnershipTiersSection.css'

const SPONSORSHIP_TIERS = [
  {
    tier: 'Presenting Sponsor',
    investment: '$5M – $15M / year',
    color: '#c9a84c',
    desc: 'Your brand as the defining named partner of a major attraction or the full campus. Maximum visibility, exclusivity, and category ownership.',
    benefits: [
      'Attraction or campus naming rights',
      'Full category exclusivity',
      'Premium digital display network (100+ screens)',
      'All event co-presenting rights',
      'Dedicated executive relationship manager',
      'Custom 360° activation integration',
    ],
  },
  {
    tier: 'Category Sponsor',
    investment: '$1M – $5M / year',
    color: '#b5453a',
    desc: 'Own your product category across the property. Exclusive rights to your vertical — no competing brands.',
    benefits: [
      'Category exclusivity (beverage, tech, finance, etc.)',
      'Prominent signage across 3M+ sq ft',
      'Priority event activation at Dream Live',
      'Social & digital content co-creation',
      'Retailer cross-promotional rights',
    ],
  },
  {
    tier: 'Activation Partner',
    investment: '$250K – $1M / year',
    color: '#f26522',
    desc: 'A defined experiential zone, seasonal activation, or themed pop-up with high ROI foot-traffic exposure.',
    benefits: [
      'Dedicated activation space (1,000–5,000 sq ft)',
      'Seasonal or year-round programming',
      'PR support and press access',
      'Social media amplification',
      'Dwell-time reporting & foot-traffic analytics',
    ],
  },
  {
    tier: 'Digital & Media Partner',
    investment: '$50K – $250K / year',
    color: '#0abab5',
    desc: 'Targeted digital advertising across American Dream\'s owned digital surfaces — screens, website, app, and social channels.',
    benefits: [
      'Rotating digital display network',
      'Email & app push notification slots',
      'Social media integrations',
      'Event-specific campaign placements',
      'Monthly analytics reporting',
    ],
  },
]

export default function PartnershipTiersSection() {
  const { goToSlideById, next, persona } = useDeck()
  const isSponsor = persona === 'sponsor'
  const [inView, setInView] = useState(false)
  const [glowBtn, setGlowBtn] = useState(false)
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { 
        if (entry.isIntersecting) {
          setInView(true)
          setTimeout(() => setGlowBtn(true), 6000)
        }
      },
      { threshold: 0.1 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section className="tiers-section" ref={ref}>
      <div className="tiers-section__inner">
        <motion.div 
          className="tiers-header"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <span className="section-label" style={{ display: 'block', textAlign: 'left' }}>Partnership Levels</span>
          <h2 className="tiers-title">Four Ways to Own the Room</h2>
        </motion.div>

        <div className="tiers-grid">
          {SPONSORSHIP_TIERS.map((t, i) => (
            <motion.div 
              key={t.tier} 
              className="tier-card"
              style={{ '--tier-color': t.color } as React.CSSProperties}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 + (i * 0.1) }}
            >
              <h3 className="tier-card__name">{t.tier}</h3>
              <span className="tier-card__investment">{t.investment}</span>
              <p className="tier-card__desc">{t.desc}</p>
              
              <ul className="tier-card__benefits">
                {t.benefits.map(b => (
                  <li key={b}>
                    <span className="tier-card__check">✓</span> {b}
                  </li>
                ))}
              </ul>
              
              <button
                className="tier-card__btn"
                style={{ background: t.color }}
                onClick={() => goToSlideById('cta')}
              >
                ENQUIRE →
              </button>
            </motion.div>
          ))}
        </div>

        {/* Sponsor persona: circular next arrow. Others: Existing Partners CTA */}
        {isSponsor ? (
          <button
            className="tiers-sponsor-next"
            onClick={() => next()}
            aria-label="Next slide"
          >
            →
          </button>
        ) : (
          <motion.button
            className={`tiers-nav-btn ${glowBtn ? 'tiers-nav-btn--glow' : ''}`}
            onClick={() => goToSlideById('existing-partners')}
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            Existing Partners →
          </motion.button>
        )}
      </div>
    </section>
  )
}

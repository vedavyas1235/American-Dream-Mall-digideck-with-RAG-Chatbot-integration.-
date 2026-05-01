import { motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { useDeck } from '../components/Deck/DeckEngine'
import './AudienceSection.css'

const AUDIENCE_METRICS = [
  { metric: '40M+', label: 'Annual Visitors', icon: '👥' },
  { metric: '$104K+', label: 'Avg Household Income', icon: '💰' },
  { metric: '68%', label: 'Female Shoppers 25–54', icon: '👩' },
  { metric: '50+', label: 'Countries Represented', icon: '🌍' },
  { metric: '3.5h', label: 'Avg Dwell Time', icon: '⏱' },
  { metric: '2.8×', label: 'Repeat Visit Rate', icon: '🔄' },
  { metric: '78%', label: 'Visitors Dine On-Site', icon: '🍽' },
  { metric: '$245', label: 'Avg Spend Per Visit', icon: '💳' },
]

export default function AudienceSection() {
  const { goToSlideById, next, persona } = useDeck()
  const isRetailer = persona === 'retailer'
  const isSponsor = persona === 'sponsor'
  const isOrganizer = persona === 'organizer'
  const useNextArrow = isRetailer || isSponsor || isOrganizer
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
    <section className="audience-section" ref={ref}>
      <div className="audience-section__inner">
        <motion.div 
          className="audience-header"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <span className="section-label">Audience Profile</span>
          <h2 className="audience-title">Who <em>You're Reaching</em></h2>
          <div className="gold-line gold-line-center" />
        </motion.div>

        <div className="audience-grid">
          {AUDIENCE_METRICS.map((m, i) => (
            <motion.div 
              key={m.label} 
              className="audience-card"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.2 + (i * 0.05) }}
            >
              <span className="audience-card__icon">{m.icon}</span>
              <span className="audience-card__value">{m.metric}</span>
              <span className="audience-card__label">{m.label}</span>
            </motion.div>
          ))}
        </div>

        {/* Retailer + Sponsor: circular next arrow. Others: Partnership Levels CTA */}
        {useNextArrow ? (
          <button
            className="audience-retailer-next"
            onClick={() => next()}
            aria-label="Next slide"
          >
            →
          </button>
        ) : (
          <motion.button
            className={`audience-nav-btn ${glowBtn ? 'audience-nav-btn--glow' : ''}`}
            onClick={() => goToSlideById('partnership-tiers')}
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 1 }}
          >
            Partnership Levels →
          </motion.button>
        )}
      </div>
    </section>
  )
}

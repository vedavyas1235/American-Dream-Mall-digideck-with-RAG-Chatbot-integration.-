import { useState } from 'react'
import { motion } from 'framer-motion'
import { useDeck, PERSONA_CONFIGS, type Persona } from '../components/Deck/DeckEngine'
import './OpportunitySection.css'

const CARDS: {
  id: Persona
  icon: string
  headline: string
  stats: { value: string; label: string }[]
}[] = [
  {
    id: 'retailer',
    icon: '🏢',
    headline: 'Your Brand.\nAmong the Best\nIn The World.',
    stats: [
      { value: '40M+', label: 'Annual Visitors' },
      { value: '$245', label: 'Avg Spend Per Visit' },
      { value: '$104K+', label: 'Avg Household Income' },
      { value: '3.2×', label: 'Conversion vs Avg Mall' },
    ],
  },
  {
    id: 'sponsor',
    icon: '🤝',
    headline: "Don't Advertise.\nBecome Part\nOf The Destination.",
    stats: [
      { value: '3+', label: 'Naming Rights Deals' },
      { value: '10yr', label: 'Exclusivity Available' },
      { value: '250M+', label: 'Media Impressions / yr' },
      { value: '50+', label: 'Countries Represented' },
    ],
  },
  {
    id: 'organizer',
    icon: '🎯',
    headline: 'Seven Venues.\nOne Address.\nUnlimited Scale.',
    stats: [
      { value: '7', label: 'Distinct Event Venues' },
      { value: '10,000+', label: 'Peak Capacity' },
      { value: '365', label: 'Days Available' },
      { value: '40M', label: 'Built-In Annual Audience' },
    ],
  },
]

export default function OpportunitySection() {
  const { setPersona, goToSlideById, currentSlide, goTo } = useDeck()
  const [hovered, setHovered] = useState<Persona | null>(null)

  const handleCardClick = (id: Persona) => {
    setPersona(id)
    // Navigate to the second slide in the journey (index 1 — skipping 'opportunity' itself)
    const journey = PERSONA_CONFIGS[id].journey
    goToSlideById(journey[1])
  }

  return (
    <section className="opp-section">
      <div className="opp-bg" />

      {/* Header */}
      <motion.div
        className="opp-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        <span className="section-label">Your Opportunity</span>
        <h2 className="opp-header__title">
          What Brings You<br /><em>To American Dream?</em>
        </h2>
      </motion.div>

      {/* Cards */}
      <div className="opp-cards">
        {CARDS.map((card, i) => {
          const config = PERSONA_CONFIGS[card.id]
          const isFocused = hovered === card.id
          const isOther = hovered && hovered !== card.id

          return (
            <motion.div
              key={card.id}
              className={`opp-card ${isFocused ? 'opp-card--focused' : ''} ${isOther ? 'opp-card--dimmed' : ''}`}
              style={{
                '--card-color': config.color,
                '--card-gradient': `linear-gradient(160deg, #04040a 0%, #0a0812 40%, #04040a 100%)`,
              } as React.CSSProperties}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 + i * 0.12, ease: [0.16, 1, 0.3, 1] }}
              onMouseEnter={() => setHovered(card.id)}
              onMouseLeave={() => setHovered(null)}
              onClick={() => handleCardClick(card.id)}
            >
              <div className="opp-card__bg" />
              <div className="opp-card__glow" />

              <div className="opp-card__collapsed">
                <span className="opp-card__icon">{card.icon}</span>
                <span className="opp-card__role">{config.label}</span>
                <div className="opp-card__divider" />

                <h3 className="opp-card__headline">
                  {card.headline.split('\n').map((line, j) => (
                    <span key={j}>{line}<br /></span>
                  ))}
                </h3>

                {/* Stats */}
                <div className="opp-card__stats">
                  {card.stats.map(s => (
                    <div key={s.label} className="opp-stat">
                      <span className="opp-stat__value">{s.value}</span>
                      <span className="opp-stat__label">{s.label}</span>
                    </div>
                  ))}
                </div>

                {/* Journey preview dots */}
                <div className="opp-card__journey-dots">
                  {PERSONA_CONFIGS[card.id].journey.slice(1).map((_, di) => (
                    <div key={di} className="opp-journey-dot" />
                  ))}
                </div>

                <div className="opp-card__cta">Select →</div>
              </div>
            </motion.div>
          )
        })}
      </div>

      <motion.p
        className="opp-hint"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
      >
        Select your role to begin your personalised journey
      </motion.p>

      {/* Browse full deck — linear navigation, no persona */}
      <motion.button
        className="opp-browse-btn"
        onClick={() => goTo(currentSlide + 1)}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 0.6 }}
      >
        Browse Full Presentation
      </motion.button>
    </section>
  )
}

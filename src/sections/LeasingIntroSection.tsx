import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { useDeck } from '../components/Deck/DeckEngine'
import './LeasingIntroSection.css'

const STATS = [
  { value: '3M+', label: 'Total Sq Ft', sub: 'Gross leasable area' },
  { value: '45%', label: 'Retail Mix', sub: '55% entertainment' },
  { value: '450+', label: 'Total Tenants', sub: 'Retail, dining & specialty' },
  { value: '40M+', label: 'Annual Visitors', sub: 'Built-in foot traffic' },
  { value: '$104K+', label: 'Avg HHI', sub: 'Median household income' },
  { value: '3.2×', label: 'Conversion Rate', sub: 'vs. avg US mall' },
]

export default function LeasingIntroSection() {
  const { goToSlideById } = useDeck()
  const [inView, setInView] = useState(false)
  const [glowBtn, setGlowBtn] = useState(false)
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { 
        if (entry.isIntersecting) {
            setInView(true) 
            setTimeout(() => setGlowBtn(true), 7000)
        }
      },
      { threshold: 0.1 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section className="leasing-intro" ref={ref}>
      <div className="leasing-intro__bg-wrap">
        <img
          className="leasing-intro__bg"
          src="/assets/images/leasing_crowd_emotion.png"
          alt="Massive retail crowd"
        />
      </div>
      <div className="leasing-intro__overlay" />
      
      <div className="leasing-intro__content">
        <motion.div 
           initial={{ opacity: 0, y: 30 }} 
           animate={inView ? { opacity: 1, y: 0 } : {}} 
           transition={{ duration: 0.8 }}
        >
          <span className="section-label">Leasing Opportunities</span>
          <h1 className="leasing-intro__title">Your Brand.<br /><em>40 Million Customers.</em></h1>
          <div className="gold-line" />
          <p className="leasing-intro__desc">
            American Dream is not a tenant relationship — it's a traffic partnership.
            With 3 million square feet, six distinct courts, and The Avenue luxury wing,
            we offer formats from 200 sq ft kiosks to 200,000 sq ft anchors.
          </p>
        </motion.div>
      </div>

      <motion.button
        className={`leasing-intro-btn ${glowBtn ? 'leasing-intro-btn--glow' : ''}`}
        onClick={() => goToSlideById('mall-layout')}
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 0.8, delay: 1 }}
      >
        Mall Layout →
      </motion.button>

      <div className="leasing-intro__stats">
        {STATS.map((s, i) => (
          <motion.div 
            key={s.label} 
            className="leasing-intro__stat"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 + (i * 0.1) }}
          >
            <span className="leasing-intro__stat-value">{s.value}</span>
            <span className="leasing-intro__stat-label">{s.label}</span>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

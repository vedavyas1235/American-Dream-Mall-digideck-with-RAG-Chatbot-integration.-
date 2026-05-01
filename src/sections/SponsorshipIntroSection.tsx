import { motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { useDeck } from '../components/Deck/DeckEngine'
import './SponsorshipIntroSection.css'

export default function SponsorshipIntroSection() {
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
    <section className="sp-intro" ref={ref}>
      <video
        className="sp-intro__bg"
        src="/assets/videos/your_brand.mp4"
        autoPlay
        muted
        loop
        playsInline
      />
      <div className="sp-intro__overlay" />
      
      <div className="sp-intro__content">
        <motion.div 
           initial={{ opacity: 0, y: 30 }} 
           animate={inView ? { opacity: 1, y: 0 } : {}} 
           transition={{ duration: 0.8 }}
        >
          <span className="section-label">Brand Sponsorship</span>
          <h1 className="sp-intro__title">40 Million People.<br /><em>Your Brand.</em></h1>
          <div className="gold-line" />
          <p className="sp-intro__desc">
            American Dream offers the most unique sponsorship canvas in North America.
            Brands don't just advertise here — they become part of the destination.
            From 10-year naming rights to seasonal activations, we build partnerships that perform.
          </p>
        </motion.div>
      </div>

      {/* Sponsor persona: circular next arrow. Others: Audience Profile CTA */}
      {isSponsor ? (
        <button
          className="sp-intro-sponsor-next"
          onClick={() => next()}
          aria-label="Next slide"
        >
          →
        </button>
      ) : (
        <motion.button
          className={`sp-intro-btn ${glowBtn ? 'sp-intro-btn--glow' : ''}`}
          onClick={() => goToSlideById('audience')}
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 1 }}
        >
          Audience Profile →
        </motion.button>
      )}
    </section>
  )
}

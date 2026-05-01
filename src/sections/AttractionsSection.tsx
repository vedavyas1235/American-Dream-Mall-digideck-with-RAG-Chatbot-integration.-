import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import './AttractionsSection.css'

const ATTRACTIONS = [
  {
    id: 'bigsnow',
    name: 'Big SNOW',
    tagline: 'North America\'s Only Indoor Real Snow Ski Slope',
    description:
      'Year-round skiing, snowboarding, and snow tubing on 180,000 sq ft of real snow — regardless of weather. The only indoor ski slope in North America. An attraction that draws visitors from across the continent, generating media coverage no advertising budget can buy.',
    stats: [
      { v: '12', l: 'Ski Runs' },
      { v: '180K', l: 'Sq Ft of Snow' },
      { v: '365', l: 'Days a Year' },
    ],
    img: 'https://images.pexels.com/photos/848612/pexels-photo-848612.jpeg?auto=compress&cs=tinysrgb&w=1200',
    video: '/assets/videos/big_snow.mp4',
    color: '#4a9eff',
    youtubeId: 'N50D6lbUYHg',
  },
  {
    id: 'nickelodeon',
    name: 'Nickelodeon Universe',
    tagline: 'North America\'s Largest Indoor Theme Park',
    description:
      '8 acres of indoor thrills inside American Dream. 35 rides and attractions, including the world\'s largest indoor loop coaster. Themed around beloved Nickelodeon brands — SpongeBob, Dora, PAW Patrol, and more. A massive, permanent traffic driver that fills the property with families every single day.',
    stats: [
      { v: '8', l: 'Acres Indoor' },
      { v: '35+', l: 'Rides & Attractions' },
      { v: '#1', l: 'Indoor Theme Park in NA' },
    ],
    img: 'https://images.pexels.com/photos/1036936/pexels-photo-1036936.jpeg?auto=compress&cs=tinysrgb&w=1200',
    video: '/assets/videos/nickelodeon.mp4',
    color: '#ff6b00',
    youtubeId: 'WZBmyDaKB1w',
  },
  {
    id: 'dreamworks',
    name: 'DreamWorks Water Park',
    tagline: 'North America\'s Largest Indoor Water Park',
    description:
      '532,000 sq ft of year-round aquatic adventure. Themed around DreamWorks blockbusters — Shrek, Madagascar, Kung Fu Panda. 15 water slides, a wave pool, and a lazy river — all indoors, all year long. A destination destination that drives overnight stays to adjacent properties.',
    stats: [
      { v: '532K', l: 'Sq Ft' },
      { v: '40+', l: 'Water Attractions' },
      { v: '12mo', l: 'Year-Round' },
    ],
    img: 'https://images.pexels.com/photos/1449934/pexels-photo-1449934.jpeg?auto=compress&cs=tinysrgb&w=1200',
    video: '/assets/videos/water_park.mp4',
    color: '#00b4d8',
    youtubeId: '',
  },
  {
    id: 'sealife',
    name: 'SEA LIFE Aquarium',
    tagline: 'Wonder Beneath the Surface',
    description:
      '200+ species of marine life in an immersive, 360° underwater tunnel experience. Partnered with Merlin Entertainments — the world\'s leading family attraction operator. Draws school groups, families, and curious visitors year-round.',
    stats: [
      { v: '200+', l: 'Marine Species' },
      { v: '360°', l: 'Underwater Tunnel' },
      { v: 'Merlin', l: 'Global Partner' },
    ],
    img: 'https://images.pexels.com/photos/3894157/pexels-photo-3894157.jpeg?auto=compress&cs=tinysrgb&w=1200',
    video: '/assets/videos/sea_life.mp4',
    color: '#00897b',
    youtubeId: '',
  },
]

export default function AttractionsSection() {
  const [active, setActive] = useState(0)
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

  // Auto-play logic
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (!inView) return
    timerRef.current = setTimeout(() => {
      setActive((prev) => (prev + 1) % ATTRACTIONS.length)
    }, 6000) // Cycle every 6 seconds
    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, [active, inView])

  const att = ATTRACTIONS[active]

  return (
    <section id="attractions" className="attractions-section" ref={ref}>
      {/* Background */}
      <AnimatePresence mode="wait">
        <motion.div
          key={att.id + '-bg'}
          className="attractions-section__bg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7 }}
        >
          {att.video ? (
            <video
              src={att.video}
              autoPlay
              muted
              loop
              playsInline
              style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', top: 0, left: 0, zIndex: 0 }}
            />
          ) : (
            <img src={att.img} alt={att.name} />
          )}
          <div className="attractions-section__bg-overlay" />
        </motion.div>
      </AnimatePresence>

      <div className="attractions-section__inner">
        {/* Header */}
        <motion.div
          className="attractions-section__header"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <span className="section-label">Attractions & Entertainment</span>
          <h2 className="attractions-section__title">
            Where Else Can You Ski,<br />
            <em>Surf, and Shop?</em>
          </h2>
        </motion.div>

        {/* Tab selector */}
        <motion.div
          className="attractions-tabs"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          {ATTRACTIONS.map((a, i) => (
            <button
              key={a.id}
              className={`attractions-tab ${active === i ? 'attractions-tab--active' : ''}`}
              onClick={() => {
                setActive(i)
              }}
              style={{ '--accent': a.color } as React.CSSProperties}
            >
              {a.name}
            </button>
          ))}
        </motion.div>

        {/* Content panel */}
        <AnimatePresence mode="wait">
          <motion.div
            key={att.id}
            className="attractions-panel"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="attractions-panel__content">
              <span className="attractions-panel__tagline">{att.tagline}</span>
              <h3 className="attractions-panel__name" style={{ color: att.color }}>{att.name}</h3>
              <div className="gold-line" />
              <p className="attractions-panel__desc">{att.description}</p>
              <div className="attractions-panel__stats">
                {att.stats.map(s => (
                  <div key={s.l} className="attractions-stat">
                    <span className="attractions-stat__value" style={{ color: att.color }}>{s.v}</span>
                    <span className="attractions-stat__label">{s.l}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Pagination dots */}
        <div className="attractions-dots">
          {ATTRACTIONS.map((a, i) => (
            <button
              key={a.id}
              className={`attractions-dot ${active === i ? 'attractions-dot--active' : ''}`}
              onClick={() => {
                setActive(i)
              }}
              aria-label={a.name}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

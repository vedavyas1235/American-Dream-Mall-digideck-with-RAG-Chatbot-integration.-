import { useEffect, useRef, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import './ExistingPartnersSection.css'

const CURRENT_PARTNERS = [
  {
    name: 'Nickelodeon / Paramount',
    category: 'Entertainment IP',
    type: 'Attraction Partner',
    since: '2019',
    color: '#f26522',
    desc: 'Naming rights and IP licensing for Nickelodeon Universe — the largest indoor theme park in the Western Hemisphere. Character appearances, exclusive merchandise, and ongoing content activations.',
    assets: ['Full theme park naming rights', 'Character IP (SpongeBob, PAW Patrol, TMNT)', 'Live Slime Time shows', 'Exclusive in-park merchandise'],
    img: '/assets/images/nick_paramount.png'
  },
  {
    name: 'DreamWorks / Universal',
    category: 'Entertainment IP',
    type: 'Attraction Partner',
    since: '2020',
    color: '#1c3557',
    desc: 'IP partner for DreamWorks Water Park — the largest indoor water park in North America. Features Shrek, Madagascar, Trolls, and Kung Fu Panda themed water park zones and cabanas.',
    assets: ['Full water park naming rights', 'IP licensing (Shrek, Madagascar, Trolls)', '19 branded cabanas', '28 luxury skyboxes'],
    img: '/assets/images/dreamworks_waterpark.png'
  },
  {
    name: 'LEGO / Merlin Entertainments',
    category: 'Entertainment IP',
    type: 'Attraction Partner',
    since: '2021',
    color: '#e8001a',
    desc: 'LEGOLAND Discovery Center — an indoor LEGO experience featuring the Imagination Express ride, 4D cinema, and a Miniland recreation of the New York and New Jersey skyline.',
    assets: ['Full attraction naming rights', 'LEGO brand integration', '4D cinema & Miniland', 'LEGO Master Builder program'],
    img: '/assets/images/lego_discovery.png'
  },
  {
    name: 'Merlin (SEA LIFE)',
    category: 'Entertainment',
    type: 'Attraction Partner',
    since: '2021',
    color: '#00897b',
    desc: 'SEA LIFE Aquarium — world\'s leading aquarium chain. Features 200+ species and a 360° underwater tunnel. Private events, school field trips, and seasonal branded activations.',
    assets: ['Aquarium naming rights', '200+ marine species display', '360° underwater tunnel', 'Educational field trip programs'],
    img: '/assets/images/partners_sealife.png'
  },
  {
    name: 'Coca-Cola',
    category: 'FMCG / Beverage',
    type: 'Campus-Wide Sponsor',
    since: '2019',
    color: '#e8001a',
    desc: 'Exclusive 10-year beverage partnership across the entire American Dream campus. Includes branded "Coca-Cola Social Bubble" experiential zone, all-venue pouring rights, and digital branding.',
    assets: ['Exclusive campus pouring rights', 'Coca-Cola Social Bubble activation zone', 'Digital display integrations', '10-year exclusivity through 2029'],
    img: '/assets/images/partners_cocacola.png'
  },
  {
    name: 'Sesame Workshop',
    category: 'Children\'s Education / IP',
    type: 'Educational Partner',
    since: '2024',
    color: '#f9a825',
    desc: 'First-ever Sesame Street Learn & Play educational center — a 2024 partnership bringing STEAM-based learning experiences to families through Sesame Street characters and curriculum.',
    assets: ['First-ever retail Sesame Street center', 'STEAM learning curriculum', 'Character activations (Elmo, Big Bird)', 'K-5 educational programming'],
    img: 'https://images.pexels.com/photos/159823/kids-girl-pencil-drawing-159823.jpeg?auto=compress&cs=tinysrgb&w=1400'
  },
  {
    name: 'Hasbro',
    category: 'Gaming / Toys',
    type: 'Entertainment Partner',
    since: '2024',
    color: '#1c3557',
    desc: 'The Gameroom by Hasbro — a first-of-its-kind entertainment center featuring G.I. Joe laser tag, Monopoly-themed experiences, and Transformers activations. Opened 2024.',
    assets: ['The Gameroom naming rights', 'G.I. Joe laser tag arena', 'Monopoly-themed gaming zones', 'Transformers activations'],
    img: 'https://images.pexels.com/photos/3165335/pexels-photo-3165335.jpeg?auto=compress&cs=tinysrgb&w=1400'
  },
  {
    name: 'Live Nation',
    category: 'Live Entertainment',
    type: 'Entertainment Partner',
    since: '2022',
    color: '#c9a84c',
    desc: 'Multi-year partnership to anchor American Dream\'s entertainment programming. Live Nation books and produces all major concert events at Dream Live and the performing arts venue.',
    assets: ['Multi-year exclusivity', 'Booking & production rights', 'Past artists: Ludacris, Tiësto, Steve Aoki', 'Revenue share model'],
    img: 'https://images.pexels.com/photos/1190297/pexels-photo-1190297.jpeg?auto=compress&cs=tinysrgb&w=1400'
  },
  {
    name: 'Hackensack Meridian Health',
    category: 'Healthcare',
    type: 'Official Health Partner',
    since: '2021',
    color: '#0abab5',
    desc: 'Official healthcare partner of American Dream. The partnership includes in-mall wellness programming, health activation zones, and medical support services for large-scale events.',
    assets: ['Official health partner designation', 'In-mall wellness programming', 'Event medical support services', 'Healthcare activation zones'],
    img: 'https://images.pexels.com/photos/40568/medical-appointment-doctor-healthcare-40568.jpeg?auto=compress&cs=tinysrgb&w=1400'
  },
  {
    name: 'Marriott Bonvoy',
    category: 'Hospitality',
    type: 'Hotel & Rewards Partner',
    since: '2021',
    color: '#8B7355',
    desc: 'Hotel partnership offering Marriott Bonvoy members exclusive benefits, points earning opportunities, and packages tied to American Dream visits and events.',
    assets: ['Marriott Bonvoy points integration', 'Exclusive member packages', 'Hotel partnership adjacency', 'Event / hotel bundled offers'],
    img: 'https://images.pexels.com/photos/271618/pexels-photo-271618.jpeg?auto=compress&cs=tinysrgb&w=1400'
  },
  {
    name: 'Rovio (Angry Birds)',
    category: 'Gaming / IP',
    type: 'Attraction Partner',
    since: '2021',
    color: '#e8001a',
    desc: 'Angry Birds Mini Golf — 18-hole mini golf attraction fully themed around the Angry Birds franchise. Indoor, year-round attraction benefiting from the 40M annual visitor footprint.',
    assets: ['Full mini golf naming rights', 'Angry Birds IP integration', '18-hole indoor course', 'Character meet-and-greet opportunities'],
    img: '/assets/images/partners_angrybirds.png'
  },
]

export default function ExistingPartnersSection() {
  const [current, setCurrent] = useState(0)
  const [inView, setInView] = useState(false)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  
  const ref = useRef<HTMLElement>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { 
        if (entry.isIntersecting) {
            setInView(true)
        }
      },
      { threshold: 0.15 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  const goTo = useCallback((index: number) => {
    setCurrent((index + CURRENT_PARTNERS.length) % CURRENT_PARTNERS.length)
  }, [])

  useEffect(() => {
    if (!isAutoPlaying) return
    timerRef.current = setTimeout(() => { goTo(current + 1) }, 6000)
    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, [current, isAutoPlaying, goTo])

  const partner = CURRENT_PARTNERS[current]

  return (
    <section className="partners-slide-section" ref={ref}>
      {/* Background animated image */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current + '-bg'}
          className="partners-slide-bg"
          initial={{ opacity: 0, scale: 1.06 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
        >
          <img src={partner.img} alt={partner.name} />
          <div
            className="partners-slide-bg__overlay"
            style={{ '--partner-accent': partner.color } as React.CSSProperties}
          />
        </motion.div>
      </AnimatePresence>

      <div className="partners-slide-inner">
        {/* LEFT: Section header (static) */}
        <motion.div
          className="partners-slide-header"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <span className="section-label">Existing Partnerships</span>
          <h2 className="partners-slide-header__title">
            The Company<br /><em>You'll Keep</em>
          </h2>
          <div className="gold-line" />
          <p className="partners-slide-header__desc">
            From Coca-Cola's 10-year exclusive partnership to Nickelodeon Universe —
            American Dream attracts undisputed category leaders.
            Explore the bespoke integrations that drive ROI for our top-tier partners.
          </p>

          <div className="partners-dots">
            {CURRENT_PARTNERS.map((p, i) => (
              <button
                key={i}
                className={`partners-dot ${i === current ? 'partners-dot--active' : ''}`}
                onClick={() => { setIsAutoPlaying(false); goTo(i) }}
                style={{ '--dot-accent': p.color } as React.CSSProperties}
                aria-label={`Go to ${p.name}`}
              />
            ))}
          </div>

          <div className="partners-nav">
            <button className="partners-nav__btn" onClick={() => { setIsAutoPlaying(false); goTo(current - 1) }}>←</button>
            <span className="partners-nav__count">{String(current + 1).padStart(2, '0')} / {String(CURRENT_PARTNERS.length).padStart(2, '0')}</span>
            <button className="partners-nav__btn" onClick={() => { setIsAutoPlaying(false); goTo(current + 1) }}>→</button>
          </div>
        </motion.div>

        {/* RIGHT: Slide content card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={current + '-card'}
            className="partners-slide-card"
            initial={{ opacity: 0, x: 48 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -48 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="partners-slide-card__top">
              <span className="partners-slide-card__category" style={{ color: partner.color }}>{partner.category}</span>
              <span className="partners-slide-card__since">Since {partner.since}</span>
            </div>

            <h3 className="partners-slide-card__name">{partner.name}</h3>
            <span className="partners-slide-card__type">{partner.type}</span>
            
            <p className="partners-slide-card__desc">{partner.desc}</p>
            
            <ul className="partners-slide-card__assets">
              {partner.assets.map(a => (
                <li key={a}><span className="asset-dot" style={{ background: partner.color }} /> {a}</li>
              ))}
            </ul>

            {isAutoPlaying && (
              <div className="partners-progress">
                <motion.div
                  key={current + '-progress'}
                  className="partners-progress__bar"
                  style={{ background: partner.color }}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 6, ease: 'linear' }}
                />
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  )
}

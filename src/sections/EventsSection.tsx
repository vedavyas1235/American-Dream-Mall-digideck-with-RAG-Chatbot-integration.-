import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useDeck } from '../components/Deck/DeckEngine'
import './EventsSection.css'

const EVENTS = [
  {
    title: 'Concerts & Live Performances',
    img: 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=800&q=85&auto=format&fit=crop',
    desc: 'American Dream\'s central hall and dedicated performance spaces have hosted Grammy-nominated artists, New Year\'s Eve spectaculars, and sold-out live events drawing tens of thousands.',
  },
  {
    title: 'Brand Activations',
    img: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&q=85&auto=format&fit=crop',
    desc: 'Fortune 500 brands have activated inside the property — from pop-up retail experiences to immersive product launches. Foot traffic of 40M+ means your activation reaches an audience no arena can offer.',
  },
  {
    title: 'Celebrity Appearances & Signings',
    img: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800&q=85&auto=format&fit=crop',
    desc: 'American Dream has welcomed A-list talent for exclusive signing events, holiday appearances, and content creation campaigns that generate massive earned media and social engagement.',
  },
  {
    title: 'Corporate Events & Buyouts',
    img: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&q=85&auto=format&fit=crop',
    desc: 'From private buyouts of Nickelodeon Universe to exclusive seated galas in The Avenue, American Dream offers unmatched corporate event settings unavailable anywhere else in the tri-state area.',
  },
]



export default function EventsSection() {
  const { goToSlideById, next, persona } = useDeck()
  const isSponsor = persona === 'sponsor'
  const [active, setActive] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const [inView, setInView] = useState(false)
  const [glowVenueBtn, setGlowVenueBtn] = useState(false)
  
  const ref = useRef<HTMLElement>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { 
        if (entry.isIntersecting) {
          setInView(true)
          setTimeout(() => setGlowVenueBtn(true), 6000)
        }
      },
      { threshold: 0.1 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!isAutoPlaying || !inView) return
    timerRef.current = setTimeout(() => {
      setActive((prev) => (prev + 1) % EVENTS.length)
    }, 6000)
    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, [active, isAutoPlaying, inView])

  return (
    <section id="events" className="events-section" ref={ref}>
      <div className="events-section__layout">
        
        {/* LEFT: Header & Slideshow Text */}
        <div className="events-left">
          <motion.div
            className="events-section__header"
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="section-label">Events & Platform</span>
            <h2 className="events-section__title">
              A Global Platform.<br />
              <em>Not Just a Building.</em>
            </h2>
          </motion.div>

          <div className="events-slideshow">
            <AnimatePresence mode="wait">
              <motion.div 
                key={active}
                className="events-slideshow__content"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="gold-accent-bar" style={{ width: 40, height: 2, background: 'var(--color-gold)', marginBottom: 24 }} />
                <p className="events-slideshow__desc">{EVENTS[active].desc}</p>
              </motion.div>
            </AnimatePresence>

            <div className="events-dots">
                {EVENTS.map((_, i) => (
                    <button
                        key={i}
                        className={`events-dot ${active === i ? 'events-dot--active' : ''}`}
                        onClick={() => { setActive(i); setIsAutoPlaying(false); }}
                        aria-label={`Go to event ${i}`}
                    />
                ))}
            </div>

            {/* Sponsor persona: circular next arrow. Others: Venue Directory CTA */}
            {isSponsor ? (
              <button
                className="events-sponsor-next"
                onClick={() => next()}
                aria-label="Next slide"
              >
                →
              </button>
            ) : (
              <motion.button
                className={`venue-directory-btn ${glowVenueBtn ? 'venue-directory-btn--glow' : ''}`}
                onClick={() => goToSlideById('venue-summary')}
                initial={{ opacity: 0 }}
                animate={inView ? { opacity: 1 } : {}}
                transition={{ duration: 0.8, delay: 0.8 }}
              >
                See Venue Directory →
              </motion.button>
            )}
          </div>
        </div>

        {/* RIGHT: Image Collage */}
        <div className="events-right">
          <div className="events-collage">
            {EVENTS.map((event, i) => (
              <div 
                key={event.title} 
                className={`events-collage__item events-collage__item--${i} ${active === i ? 'events-collage__item--active' : ''}`}
                onClick={() => { setActive(i); setIsAutoPlaying(false); }}
              >
                <img src={event.img} alt={event.title} />
                <div className="events-collage__overlay" />
                <h4 className="events-collage__title">{event.title}</h4>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  )
}

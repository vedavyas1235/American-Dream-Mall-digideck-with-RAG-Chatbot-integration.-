import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import './DiningSection.css'

const DINING_SPOTS = [
  {
    name: 'Aiya',
    category: 'Japanese Omakase',
    images: [
      '/assets/images/japanese_omakase_aiya.png',
      '/assets/images/japanese_omakase_plate.png',
      '/assets/images/japanese_omakase_interior.png'
    ],
    desc: 'An intimate, curated omakase experience with seasonal Japanese cuisine.',
  },
  {
    name: 'Don Angie',
    category: 'Italian Fine Dining',
    images: [
      '/assets/images/italian_dining_interior.png',
      '/assets/images/italian_dining_pasta.png',
      '/assets/images/italian_dining_wine.png'
    ],
    desc: 'Award-winning Italian cooking in a warm, sophisticated setting.',
  },
  {
    name: 'Shake Shack',
    category: 'Modern Burger Bar',
    images: [
      '/assets/images/burger_bar_burger.png',
      '/assets/images/burger_bar_interior.png',
      '/assets/images/burger_bar_fries_shake.png'
    ],
    desc: 'The iconic American burger destination with a signature ShackBurger.',
  },
  {
    name: 'The Food Hall',
    category: '40+ Vendors Under One Roof',
    images: [
      '/assets/images/food_hall_interior.png',
      '/assets/images/food_hall_global_spread.png',
      '/assets/images/food_hall_live_cooking.png'
    ],
    desc: 'An artisanal marketplace featuring global cuisines, craft beverages, and live cooking.',
  },
]

function ImageSlideshow({ images, alt }: { images: string[], alt: string }) {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    if (images.length <= 1) return;
    const interval = setInterval(() => {
      setCurrent(prev => (prev + 1) % images.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [images])

  return (
    <>
      {images.map((src, idx) => (
        <img 
          key={src} 
          src={src} 
          alt={`${alt} ${idx}`} 
          loading="lazy" 
          style={{ 
            opacity: current === idx ? 1 : 0, 
            transition: 'opacity 1s ease-in-out', 
            position: idx === 0 ? 'relative' : 'absolute',
            top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover'
          }} 
        />
      ))}
    </>
  )
}

export default function DiningSection() {
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

  return (
    <section id="dining" className="dining-section" ref={ref}>
      <div className="dining-section__inner">
        <motion.div
          className="dining-section__header"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="section-label">Dining & Lifestyle</span>
          <h2 className="dining-section__title">
            Food is the <em>Destination</em>
          </h2>
          <div className="gold-line gold-line-center" />
          <p className="dining-section__desc">
            With 100+ dining concepts ranging from quick-service to white-tablecloth fine dining,
            American Dream has redefined what food inside a retail destination can be.
            Visitors don't eat here because they have to. They come here specifically to eat.
          </p>
        </motion.div>

        <div className="dining-section__grid">
          {DINING_SPOTS.map((spot, i) => (
            <motion.div
              key={spot.name}
              className="dining-card"
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="dining-card__img-wrap">
                <ImageSlideshow images={spot.images} alt={spot.name} />
                <div className="dining-card__overlay" />
              </div>
              <div className="dining-card__body">
                <span className="dining-card__category">{spot.category}</span>
                <h3 className="dining-card__name">{spot.name}</h3>
                <p className="dining-card__desc">{spot.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom highlight strip */}
        <motion.div
          className="dining-section__highlight"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 1, delay: 0.6 }}
        >
          {[
            { value: '$38', label: 'Avg. Dining Spend Per Visit' },
            { value: '4.2×', label: 'F&B Revenue vs. National Average' },
            { value: '18M+', label: 'Dining Visits Annually' },
          ].map(h => (
            <div key={h.label} className="dining-highlight-item">
              <span className="dining-highlight-value">{h.value}</span>
              <span className="dining-highlight-label">{h.label}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

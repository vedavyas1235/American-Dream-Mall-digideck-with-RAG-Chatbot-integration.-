import { useEffect, useRef, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import './LuxurySection.css'

// Real brands from americandream.com/retail — The Avenue wing
// All images use verified, high-traffic Pexels photo IDs
const LUXURY_SLIDES = [
  {
    brand: 'Saks Fifth Avenue',
    category: 'Luxury Department Store',
    location: 'Level 1 & Level 2 · The Avenue',
    tagline: 'The flagship anchor of The Avenue',
    description: `Saks Fifth Avenue anchors The Avenue with two full floors of designer fashion, beauty, and accessories. The only full-line Saks in the greater New York metro area outside its Midtown Manhattan flagship.`,
    url: 'https://www.americandream.com/stores/saks-fifth-avenue',
    img: 'https://images.pexels.com/photos/1884584/pexels-photo-1884584.jpeg?auto=compress&cs=tinysrgb&w=1400',
    video: '/assets/videos/saks_fifth_avenue.mp4',
    fallback: '#1a1208',
    accent: '#c9a84c',
  },
  {
    brand: 'Gucci',
    category: 'Italian Luxury Fashion',
    location: 'Level 1 & Level 2 · The Avenue',
    tagline: 'The house of modern luxury',
    description: `Gucci's American Dream boutique spans two levels of The Avenue, showcasing the full range of the house's iconic ready-to-wear, handbags, shoes, and accessories in an architecturally stunning setting.`,
    url: 'https://www.americandream.com/stores/gucci',
    img: 'https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&w=1400',
    video: '/assets/videos/gucci.mp4',
    fallback: '#1a0808',
    accent: '#b5453a',
  },
  {
    brand: 'Saint Laurent',
    category: 'French Luxury Fashion',
    location: 'Level 1 & Level 2 · The Avenue',
    tagline: 'Parisian edge. American scale.',
    description: `Saint Laurent brings its dark, rock-and-roll Parisian sensibility to The Avenue across two levels. Iconic YSL leather goods, footwear, and the latest ready-to-wear collections exclusively curated for this location.`,
    url: 'https://www.americandream.com/stores/saint-laurent',
    img: 'https://images.pexels.com/photos/2220316/pexels-photo-2220316.jpeg?auto=compress&cs=tinysrgb&w=1400',
    video: '/assets/videos/saint_laurent.mp4',
    fallback: '#141408',
    accent: '#d4af37',
  },
  {
    brand: 'Hermès',
    category: 'French Luxury Goods',
    location: 'Level 1 · The Avenue',
    tagline: 'The pinnacle of craft and exclusivity',
    description: `One of the world's most coveted luxury houses, Hermès brings its full collection of leather goods, silk scarves, fragrances, and ready-to-wear to The Avenue — surrounded by an unparalleled 40 million visitor catchment.`,
    url: 'https://www.americandream.com/stores/hermes',
    img: 'https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=1400',
    video: '/assets/videos/hermes.mp4',
    fallback: '#1a0d00',
    accent: '#f26522',
  },
  {
    brand: 'Balenciaga',
    category: 'Luxury Streetwear & Fashion',
    location: 'Level 1 · The Avenue',
    tagline: 'The house that redefined streetwear luxury',
    description: `Balenciaga's American Dream boutique puts the cutting edge of high fashion steps away from North America's largest indoor theme park — a juxtaposition that perfectly captures the spirit of The Avenue.`,
    url: 'https://www.americandream.com/stores/balenciaga',
    img: 'https://images.pexels.com/photos/3765132/pexels-photo-3765132.jpeg?auto=compress&cs=tinysrgb&w=1400',
    video: '/assets/videos/balenciaga.mp4',
    fallback: '#0d0d0d',
    accent: '#aaaaaa',
  },
  {
    brand: 'Tiffany & Co.',
    category: 'Luxury Jewelry & Accessories',
    location: 'Level 1 · The Avenue',
    tagline: 'The little blue box. The big stage.',
    description: `Tiffany & Co. at The Avenue offers their iconic jewelry, engagement rings, and home collection. A destination for milestone moments, powered by the 40 million visitors who pass through American Dream each year.`,
    url: 'https://www.americandream.com/stores/tiffany-co',
    img: 'https://images.pexels.com/photos/691046/pexels-photo-691046.jpeg?auto=compress&cs=tinysrgb&w=1400',
    video: '/assets/videos/tiffany_co.mp4',
    fallback: '#001a18',
    accent: '#0abab5',
  },
  {
    brand: 'Ferrari',
    category: 'Luxury Lifestyle & Automotive',
    location: 'Level 1 · The Avenue',
    tagline: 'Il Cavallino Rampante. Now at The Avenue.',
    description: `Ferrari's American Dream boutique is one of the most exclusive lifestyle retail destinations in North America. Offering the brand's iconic apparel, accessories, scale models, and bespoke merchandise — steps from Saks Fifth Avenue and Gucci.`,
    url: 'https://www.americandream.com/stores/ferrari',
    img: 'https://images.pexels.com/photos/1545743/pexels-photo-1545743.jpeg?auto=compress&cs=tinysrgb&w=1400',
    video: '/assets/videos/ferrari.mp4',
    fallback: '#1a0300',
    accent: '#e8001a',
  },
  {
    brand: 'Rolex',
    category: 'Swiss Luxury Timepieces',
    location: 'Level 1 · The Avenue',
    tagline: 'A crown for every achievement.',
    description: `The Rolex boutique at The Avenue carries the full range of Rolex sports and dress watches — from the Submariner to the Day-Date — in an authorized dealership setting that befits the world's most recognized watch brand.`,
    url: 'https://www.americandream.com/stores/rolex',
    img: 'https://images.pexels.com/photos/236748/pexels-photo-236748.jpeg?auto=compress&cs=tinysrgb&w=1400',
    video: '/assets/videos/rolex.mp4',
    fallback: '#0d1a00',
    accent: '#8B9A46',
  },
  {
    brand: 'Dolce & Gabbana',
    category: 'Italian Luxury Fashion',
    location: 'Level 1 · The Avenue',
    tagline: 'La Dolce Vita. New Jersey edition.',
    description: `Dolce & Gabbana's bold Mediterranean glamour lands in The Avenue with their full men's and women's collections, iconic accessories, and the signature DG attitude that draws high-income shoppers from across the tri-state area.`,
    url: 'https://www.americandream.com/stores/dolce-gabbana',
    img: 'https://images.pexels.com/photos/3965545/pexels-photo-3965545.jpeg?auto=compress&cs=tinysrgb&w=1400',
    video: '/assets/videos/dolce_gabbana.mp4',
    fallback: '#1a0808',
    accent: '#c9a84c',
  },
  {
    brand: 'Watches of Switzerland',
    category: 'Multi-Brand Luxury Timepieces',
    location: 'Level 1 · The Avenue',
    tagline: "The world's finest watches. One address.",
    description: `Watches of Switzerland brings its curated collection of Rolex, Patek Philippe, Audemars Piguet, and IWC to The Avenue — the only authorized multi-brand luxury watch retailer in the NY/NJ metro region.`,
    url: 'https://www.americandream.com/stores/watches-of-switzerland',
    img: 'https://images.pexels.com/photos/2783873/pexels-photo-2783873.jpeg?auto=compress&cs=tinysrgb&w=1400',
    video: '/assets/videos/watches_of_switzerland.mp4',
    fallback: '#051120',
    accent: '#1c3557',
  },
  {
    brand: 'Mulberry',
    category: 'British Luxury Leather Goods',
    location: 'Level 1 · The Avenue',
    tagline: 'Quintessentially British. Globally coveted.',
    description: `Mulberry's American Dream boutique showcases their signature Bayswater, Alexa, and Lily collections — crafted in Somerset, England — alongside seasonal leather goods and accessories for the US market.`,
    url: 'https://www.americandream.com/stores/mulberry',
    img: 'https://images.pexels.com/photos/1395967/pexels-photo-1395967.jpeg?auto=compress&cs=tinysrgb&w=1400',
    video: '/assets/videos/mulberry.mp4',
    fallback: '#140f08',
    accent: '#8B7355',
  },
  {
    brand: 'A Bathing Ape (BAPE)',
    category: 'Luxury Streetwear',
    location: 'Level 1 · The Avenue',
    tagline: 'Tokyo streetwear. Global status.',
    description: `BAPE at The Avenue bridges The Avenue's luxury positioning with the energy of Nickelodeon Universe next door. The iconic Japanese streetwear brand draws collectors, sneakerheads, and fashion-forward shoppers year-round.`,
    url: 'https://www.americandream.com/stores/bape',
    img: 'https://images.pexels.com/photos/1183266/pexels-photo-1183266.jpeg?auto=compress&cs=tinysrgb&w=1400',
    video: '/assets/videos/bape.mp4',
    fallback: '#081a08',
    accent: '#2c8c3e',
  },
]

export default function LuxurySection() {
  const [current, setCurrent] = useState(0)
  const [inView, setInView] = useState(false)
  const [imgErrors, setImgErrors] = useState<Record<number, boolean>>({})
  const ref = useRef<HTMLElement>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true) },
      { threshold: 0.15 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  const goTo = useCallback((index: number) => {
    setCurrent((index + LUXURY_SLIDES.length) % LUXURY_SLIDES.length)
  }, [])

  useEffect(() => {
    timerRef.current = setTimeout(() => { goTo(current + 1) }, 5500)
    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, [current, goTo])

  const slide = LUXURY_SLIDES[current]
  const hasBrightAccent = ['#888888', '#aaaaaa'].includes(slide.accent)

  const handleImgError = (idx: number) => {
    setImgErrors(prev => ({ ...prev, [idx]: true }))
  }

  return (
    <section id="luxury" className="luxury-section" ref={ref}>
      {/* Background image — animated swap */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current + '-bg'}
          className="luxury-bg"
          style={imgErrors[current] ? { background: slide.fallback } : undefined}
          initial={{ opacity: 0, scale: 1.06 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
        >
          {!imgErrors[current] && (slide as any).video ? (
            <video
              src={(slide as any).video}
              autoPlay
              muted
              loop
              playsInline
              style={{ 
                width: '100%', 
                height: '112%', 
                objectFit: 'cover', 
                objectPosition: 'center top',
                position: 'absolute', 
                top: 0, 
                left: 0, 
                zIndex: 0 
              }}
              onError={() => handleImgError(current)}
            />
          ) : !imgErrors[current] && (
            <img
              src={slide.img}
              alt={slide.brand}
              style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', inset: 0, zIndex: 0 }}
              onError={() => handleImgError(current)}
            />
          )}
          {/* Extra tinted overlay using brand accent for identity even on fallback */}
          <div
            className="luxury-bg__overlay"
            style={{ '--brand-accent': slide.accent } as React.CSSProperties}
          />
        </motion.div>
      </AnimatePresence>

      {/* Content layout */}
      <div className="luxury-inner">

        {/* LEFT: Section header */}
        <motion.div
          className="luxury-header"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <span className="section-label">Retail & Luxury · The Avenue</span>
          <h2 className="luxury-header__title">
            The Only Luxury Wing<br />
            With a <em>Theme Park</em><br />
            Next Door
          </h2>
          <div className="gold-line" />
          <p className="luxury-header__desc">
            The Avenue at American Dream is the most ambitious luxury retail
            concept in the Western Hemisphere — housing the world's most coveted
            fashion houses under one roof, with 40 million potential customers
            passing through every year.
          </p>

          {/* Slide dots nav */}
          <div className="luxury-dots">
            {LUXURY_SLIDES.map((s, i) => (
              <button
                key={i}
                className={`luxury-dot ${i === current ? 'luxury-dot--active' : ''}`}
                onClick={() => goTo(i)}
                aria-label={`Go to ${s.brand}`}
                style={{ '--dot-accent': s.accent } as React.CSSProperties}
              />
            ))}
          </div>

          {/* Prev / Next */}
          <div className="luxury-nav">
            <button
              className="luxury-nav__btn"
              onClick={() => goTo(current - 1)}
              aria-label="Previous brand"
            >
              ←
            </button>
            <span className="luxury-nav__count">
              {String(current + 1).padStart(2, '0')} / {String(LUXURY_SLIDES.length).padStart(2, '0')}
            </span>
            <button
              className="luxury-nav__btn"
              onClick={() => goTo(current + 1)}
              aria-label="Next brand"
            >
              →
            </button>
          </div>
        </motion.div>

        {/* RIGHT: Slide content card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={current + '-card'}
            className="luxury-card"
            initial={{ opacity: 0, x: 48 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -48 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Location badge */}
            <div className="luxury-card__location">
              <span className="luxury-card__location-dot" style={{ background: slide.accent }} />
              {slide.location}
            </div>

            <span className="luxury-card__category">{slide.category}</span>

            <h3
              className="luxury-card__brand"
              style={{ color: hasBrightAccent ? '#f5f5f0' : slide.accent }}
            >
              {slide.brand}
            </h3>

            <p className="luxury-card__tagline">{slide.tagline}</p>
            <div className="gold-line" />
            <p className="luxury-card__desc">{slide.description}</p>

            <div className="luxury-progress">
                <motion.div
                  key={current + '-progress'}
                  className="luxury-progress__bar"
                  style={{ background: hasBrightAccent ? '#c9a84c' : slide.accent }}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 5.5, ease: 'linear' }}
                />
            </div>

            <a
              href={slide.url}
              target="_blank"
              rel="noopener noreferrer"
              className="luxury-card__cta"
              style={{ color: hasBrightAccent ? '#c9a84c' : slide.accent }}
            >
              View Store Details →
            </a>
          </motion.div>
        </AnimatePresence>
      </div>


    </section>
  )
}

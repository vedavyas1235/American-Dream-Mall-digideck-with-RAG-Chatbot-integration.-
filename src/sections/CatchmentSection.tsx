import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import './ScaleSection.css'

export default function CatchmentSection() {
  const [inView, setInView] = useState(false)
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true) },
      { threshold: 0.2 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section id="catchment" className="scale-section slide-section" ref={ref}>
      <div className="scale-section__inner slide-inner">
        {/* Map / Location visual */}
        <motion.div
          className="scale-section__location"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, delay: 0.1 }}
        >
          <div className="scale-section__location-text">
            <span className="section-label">Catchment Area</span>
            <h3>20 Million People Within 30 Miles</h3>
            <div className="gold-line" />
            <p>
              Positioned at the intersection of I-95 and NJ Turnpike, American Dream sits at the heart
              of the most densely populated, highest-income corridor in the United States. Serviced by
              NJ Transit and direct shuttles from Port Authority, the property is accessible to all of
              Metro New York — and visitors from 50+ countries annually.
            </p>
            <ul className="scale-section__location-list">
              <li><span className="dot" />14 miles from Midtown Manhattan</li>
              <li><span className="dot" />Direct transit via NJ Transit & shuttle</li>
              <li><span className="dot" />Adjacent to MetLife Stadium</li>
              <li><span className="dot" />Average household income: $104,000+</li>
              <li><span className="dot" />International visitors from 50+ countries</li>
            </ul>
          </div>
          <div className="scale-section__map">
            <div className="scale-section__map-img-wrap">
              <video
                src="/assets/videos/american_dream_intro.mp4"
                autoPlay
                muted
                loop
                playsInline
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
            <div className="scale-section__map-caption">
              American Dream · East Rutherford, NJ
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

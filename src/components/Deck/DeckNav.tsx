import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useDeck } from './DeckEngine'
import ChatBot from './ChatBot'

// Slide IDs where the → next arrow is hidden
const HIDE_NEXT_IDS = new Set([
  'opportunity',
  'scale',
  'leasing-intro',
  'mall-layout',
  'sponsorship-intro',
  'audience',
  'partnership-tiers',
  'events',
  'venue-summary',
  'cta',
])

export default function DeckNav() {
  const {
    currentSlide, totalSlides, chapters, slides,
    goTo, next, prev,
    persona, personaConfig, journeyStep, journeyTotal,
    clearPersona,
  } = useDeck()

  const [drawerOpen, setDrawerOpen] = useState(false)
  const [glowNext, setGlowNext] = useState(false)
  const [chatOpen, setChatOpen] = useState(false)

  const currentSlideId = slides[currentSlide]?.id ?? ''
  const isLastSlide = currentSlide === totalSlides - 1
  const journeyActive = !!persona && !!personaConfig

  // Glow timer
  useEffect(() => {
    setGlowNext(false)
    let t: ReturnType<typeof setTimeout> | null = null
    if (currentSlide === 0) {
      t = setTimeout(() => setGlowNext(true), 90000)
    } else if (currentSlideId === 'attractions') {
      t = setTimeout(() => setGlowNext(true), 24000)
    }
    return () => { if (t) clearTimeout(t) }
  }, [currentSlide, currentSlideId])

  // Listen for Ask AI trigger from CTASection (persona mode)
  useEffect(() => {
    const handler = () => setChatOpen(true)
    window.addEventListener('deck:open-chat', handler)
    return () => window.removeEventListener('deck:open-chat', handler)
  }, [])

  const closeDrawer = () => setDrawerOpen(false)
  const showNextArrow = !HIDE_NEXT_IDS.has(currentSlideId) && !isLastSlide
  const showTopBar = currentSlide !== 0 || glowNext

  return (
    <>
      {/* ══════════════════════════════════════════════════
          UNIFIED NAV BAR  (single bar, always one row)
          Layout: [☰] [persona badge + dots] | AMERICAN DREAM | [Change Role] [Ask AI]
          ══════════════════════════════════════════════════ */}
      {showTopBar && (
        <div
          className="deck-topbar"
          style={
            journeyActive && personaConfig
              ? { borderBottomColor: personaConfig.color + '55' } as React.CSSProperties
              : {}
          }
        >
          {/* ── LEFT: Hamburger + persona badge ── */}
          <div className="deck-topbar__left">
            <button
              className="deck-topbar__hamburger"
              onClick={() => setDrawerOpen(o => !o)}
              aria-label={drawerOpen ? 'Close menu' : 'Open navigation menu'}
            >
              <span className={`deck-topbar__bar ${drawerOpen ? 'deck-topbar__bar--open' : ''}`} />
              <span className={`deck-topbar__bar ${drawerOpen ? 'deck-topbar__bar--open' : ''}`} />
              <span className={`deck-topbar__bar ${drawerOpen ? 'deck-topbar__bar--open' : ''}`} />
            </button>

            {/* Persona badge + step dots — only when journey active */}
            {journeyActive && personaConfig && (
              <div
                className="deck-topbar__persona"
                style={{ '--persona-color': personaConfig.color } as React.CSSProperties}
              >
                <span className="deck-topbar__persona-badge">
                  {persona === 'retailer' ? '🏢' : persona === 'sponsor' ? '🤝' : '🎯'}
                  <span className="deck-topbar__persona-label">{personaConfig.label}</span>
                </span>
                <div className="deck-topbar__journey-dots">
                  {personaConfig.journey.map((id, i) => (
                    <div
                      key={id}
                      className={`deck-topbar__dot
                        ${i === journeyStep ? 'deck-topbar__dot--active' : ''}
                        ${i < journeyStep ? 'deck-topbar__dot--done' : ''}
                      `}
                      title={slides.find(s => s.id === id)?.slideLabel}
                    />
                  ))}
                </div>
                <span className="deck-topbar__step">{journeyStep + 1}/{journeyTotal}</span>
              </div>
            )}
          </div>

          {/* ── CENTER: Brand ── */}
          <span className="deck-topbar__title">American Dream</span>

          {/* ── RIGHT: Change Role + Ask AI placeholder ── */}
          <div className="deck-topbar__right">
            {/* Change Role — second from right */}
            {journeyActive && (
              <button
                className="deck-topbar__change-role"
                style={{ '--persona-color': personaConfig!.color } as React.CSSProperties}
                onClick={() => { clearPersona(); goTo(1) }}
                title="Go back and choose a different role"
              >
                ✕ Change Role
              </button>
            )}
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════
          DRAWER
          ══════════════════════════════════════════════════ */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            <motion.div
              className="deck-drawer-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.22 }}
              onClick={closeDrawer}
            />
            <motion.div
              className="deck-drawer"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="deck-drawer__header">
                <span className="deck-drawer__brand">American Dream</span>
                <button className="deck-drawer__close" onClick={closeDrawer} aria-label="Close navigation">×</button>
              </div>

              {/* Journey shortcut when persona active */}
              {journeyActive && personaConfig && (
                <div
                  className="deck-drawer__journey"
                  style={{ borderColor: personaConfig.color + '66' }}
                >
                  <span
                    className="deck-drawer__journey-label"
                    style={{ color: personaConfig.color }}
                  >
                    {persona === 'retailer' ? '🏢' : persona === 'sponsor' ? '🤝' : '🎯'} {personaConfig.label} Journey
                  </span>
                  <div className="deck-drawer__journey-slides">
                    {personaConfig.journey.map((id, i) => {
                      const slideConfig = slides.find(s => s.id === id)
                      const isActive = currentSlideId === id
                      return (
                        <button
                          key={id}
                          className={`deck-journey-slide-btn ${isActive ? 'deck-journey-slide-btn--active' : ''} ${i < journeyStep ? 'deck-journey-slide-btn--done' : ''}`}
                          style={isActive ? { borderColor: personaConfig.color, color: personaConfig.color } : {}}
                          onClick={() => { goTo(slides.findIndex(s => s.id === id)); closeDrawer() }}
                        >
                          <span className="deck-journey-slide-btn__num">{i + 1}</span>
                          {slideConfig?.slideLabel ?? id}
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Full chapter nav — only shown when NO persona is active (linear / Browse Full Presentation) */}
              {!journeyActive && (
                <nav className="deck-drawer__nav" aria-label="Deck navigation">
                  {chapters.map((chapter, ci) => (
                    <div key={chapter.label} className="deck-chapter">
                      <button
                        className="deck-chapter__label"
                        onClick={() => { goTo(chapter.slideIndices[0]); closeDrawer() }}
                      >
                        {chapter.label}
                      </button>
                      <div className="deck-chapter__slides">
                        {chapter.slideIndices.map(idx => (
                          <button
                            key={idx}
                            className={`deck-slide-btn ${currentSlide === idx ? 'deck-slide-btn--active' : ''}`}
                            onClick={() => { goTo(idx); closeDrawer() }}
                          >
                            {slides[idx].slideLabel}
                          </button>
                        ))}
                      </div>
                      {ci < chapters.length - 1 && <div className="deck-drawer__divider" />}
                    </div>
                  ))}
                </nav>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ══════════════════════════════════════════════════
          BOTTOM ARROWS
          ══════════════════════════════════════════════════ */}
      <div className="deck-arrows" role="navigation" aria-label="Slide navigation">
        <button
          className="deck-arrow deck-arrow--prev"
          onClick={prev}
          style={{ opacity: currentSlide === 0 ? 0 : 1, pointerEvents: currentSlide === 0 ? 'none' : 'auto' }}
          aria-label="Previous slide"
        >
          ←
        </button>

        {showNextArrow && (
          <button
            className={`deck-arrow deck-arrow--next ${glowNext ? 'deck-arrow--glow' : ''}`}
            onClick={next}
            aria-label="Next slide"
            style={
              journeyActive && personaConfig
                ? { borderColor: personaConfig.color + '88', color: personaConfig.color }
                : {}
            }
          >
            →
          </button>
        )}
      </div>

      {/* ══════════════════════════════════════════════════
          RIGHT-SIDE JOURNEY PROGRESS DOTS
          One dot per journey slide. Only shown in persona mode.
          ══════════════════════════════════════════════════ */}
      {journeyActive && personaConfig && (
        <nav
          className="deck-journey-dots-strip"
          aria-label="Journey progress"
          style={{ '--persona-color': personaConfig.color } as React.CSSProperties}
        >
          {personaConfig.journey.map((id, i) => {
            const slideConfig = slides.find(s => s.id === id)
            const isActive = i === journeyStep
            const isDone   = i < journeyStep
            return (
              <button
                key={id}
                className={`deck-jdot ${
                  isActive ? 'deck-jdot--active' :
                  isDone   ? 'deck-jdot--done'   : ''
                }`}
                onClick={() => goTo(slides.findIndex(s => s.id === id))}
                title={slideConfig?.slideLabel ?? id}
                aria-label={`Go to ${slideConfig?.slideLabel ?? id}`}
              />
            )
          })}
        </nav>
      )}

      {/* Ask AI (ChatBot) — topbar button visible only on linear deck (no persona)
          In persona mode, Ask AI is placed beside the 3D Map button in CTASection */}
      <ChatBot
        isLastSlide={!persona && (currentSlideId === 'cta' || currentSlideId === 'mall-3d')}
        isOpen={chatOpen}
        onToggle={() => setChatOpen(o => !o)}
      />
    </>
  )
}

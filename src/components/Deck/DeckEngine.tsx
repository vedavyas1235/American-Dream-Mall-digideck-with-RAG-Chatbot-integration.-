import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from 'react'
import { AnimatePresence } from 'framer-motion'
import DeckNav from './DeckNav'
import DeckSlide from './DeckSlide'

// ── Section imports ───────────────────────────────────────────────────────────
import HeroSection from '../../sections/HeroSection'
import ScaleSection from '../../sections/ScaleSection'
import CatchmentSection from '../../sections/CatchmentSection'
import LuxurySection from '../../sections/LuxurySection'
import OpportunitySection from '../../sections/OpportunitySection'
import DiningSection from '../../sections/DiningSection'
import AttractionsSection from '../../sections/AttractionsSection'
import EventsSection from '../../sections/EventsSection'
import VenueDirectorySection from '../../sections/VenueDirectorySection'
import LeasingIntroSection from '../../sections/LeasingIntroSection'
import MallLayoutSection from '../../sections/MallLayoutSection'
import LeasingFormatsSection from '../../sections/LeasingFormatsSection'
import AudienceSection from '../../sections/AudienceSection'
import SponsorshipIntroSection from '../../sections/SponsorshipIntroSection'
import PartnershipTiersSection from '../../sections/PartnershipTiersSection'
import ExistingPartnersSection from '../../sections/ExistingPartnersSection'
import EventHistorySection from '../../sections/EventHistorySection'
import CTASection from '../../sections/CTASection'
import VenuesPage from '../../pages/VenuesPage'
import MallExplorer3D from '../../sections/MallExplorer3D/MallExplorer3D'

import './Deck.css'

// ── Types ─────────────────────────────────────────────────────────────────────

export interface SlideConfig {
  id: string
  chapterLabel: string
  slideLabel: string
  component: React.ComponentType<Record<string, unknown>>
}

export interface ChapterGroup {
  label: string
  slideIndices: number[]
}

export type Persona = 'retailer' | 'sponsor' | 'organizer'

export interface PersonaConfig {
  label: string
  color: string        // CSS color for top bar & UI accents
  journey: string[]   // ordered slide IDs for this persona
}

export interface DeckContextType {
  currentSlide: number
  totalSlides: number
  slides: SlideConfig[]
  chapters: ChapterGroup[]
  direction: number
  persona: Persona | null
  personaConfig: PersonaConfig | null
  journeyStep: number        // 0-based index within current journey
  journeyTotal: number       // total steps in current journey
  setPersona: (p: Persona) => void
  clearPersona: () => void
  goTo: (n: number) => void
  next: () => void
  prev: () => void
  goToSlideById: (id: string) => void
}

// ── Master slide list ─────────────────────────────────────────────────────────

export const SLIDES: SlideConfig[] = [
  {
    id: 'intro',
    chapterLabel: 'Opening',
    slideLabel: 'Cinematic Intro',
    component: HeroSection as React.ComponentType<Record<string, unknown>>,
  },
  {
    id: 'opportunity',
    chapterLabel: 'Your Opportunity',
    slideLabel: 'Opportunity Configurator',
    component: OpportunitySection as React.ComponentType<Record<string, unknown>>,
  },
  {
    id: 'scale',
    chapterLabel: 'Why American Dream',
    slideLabel: 'The Numbers',
    component: ScaleSection as React.ComponentType<Record<string, unknown>>,
  },
  {
    id: 'catchment',
    chapterLabel: 'Why American Dream',
    slideLabel: 'Catchment Area',
    component: CatchmentSection as React.ComponentType<Record<string, unknown>>,
  },
  {
    id: 'luxury',
    chapterLabel: 'Luxury',
    slideLabel: 'The Avenue',
    component: LuxurySection as React.ComponentType<Record<string, unknown>>,
  },
  {
    id: 'dining',
    chapterLabel: 'Dining & Lifestyle',
    slideLabel: 'Dining Overview',
    component: DiningSection as React.ComponentType<Record<string, unknown>>,
  },
  {
    id: 'attractions',
    chapterLabel: 'Attractions & Entertainment',
    slideLabel: 'Attractions',
    component: AttractionsSection as React.ComponentType<Record<string, unknown>>,
  },
  {
    id: 'leasing-intro',
    chapterLabel: 'Leasing Opportunities',
    slideLabel: 'Leasing Overview',
    component: LeasingIntroSection as React.ComponentType<Record<string, unknown>>,
  },
  {
    id: 'mall-layout',
    chapterLabel: 'Leasing Opportunities',
    slideLabel: 'Mall Layout',
    component: MallLayoutSection as React.ComponentType<Record<string, unknown>>,
  },
  {
    id: 'leasing-formats',
    chapterLabel: 'Leasing Opportunities',
    slideLabel: 'Leasing Formats',
    component: LeasingFormatsSection as React.ComponentType<Record<string, unknown>>,
  },
  {
    id: 'sponsorship-intro',
    chapterLabel: 'Brand Partnerships',
    slideLabel: 'Partnership Overview',
    component: SponsorshipIntroSection as React.ComponentType<Record<string, unknown>>,
  },
  {
    id: 'audience',
    chapterLabel: 'Brand Partnerships',
    slideLabel: 'Audience Profile',
    component: AudienceSection as React.ComponentType<Record<string, unknown>>,
  },
  {
    id: 'partnership-tiers',
    chapterLabel: 'Brand Partnerships',
    slideLabel: 'Partnership Levels',
    component: PartnershipTiersSection as React.ComponentType<Record<string, unknown>>,
  },
  {
    id: 'existing-partners',
    chapterLabel: 'Brand Partnerships',
    slideLabel: 'Existing Partners',
    component: ExistingPartnersSection as React.ComponentType<Record<string, unknown>>,
  },
  {
    id: 'events',
    chapterLabel: 'Events & Platform',
    slideLabel: 'Events Overview',
    component: EventsSection as React.ComponentType<Record<string, unknown>>,
  },
  {
    id: 'venue-summary',
    chapterLabel: 'Events & Platform',
    slideLabel: 'Venue Directory',
    component: VenueDirectorySection as React.ComponentType<Record<string, unknown>>,
  },
  {
    id: 'venue-detail',
    chapterLabel: 'Events & Platform',
    slideLabel: 'Venue Details',
    component: VenuesPage as React.ComponentType<Record<string, unknown>>,
  },
  {
    id: 'event-history',
    chapterLabel: 'Events & Platform',
    slideLabel: 'Event History',
    component: EventHistorySection as React.ComponentType<Record<string, unknown>>,
  },
  {
    id: 'cta',
    chapterLabel: 'Get Started',
    slideLabel: 'Partner With Us',
    component: CTASection as React.ComponentType<Record<string, unknown>>,
  },
  {
    id: 'mall-3d',
    chapterLabel: 'Mall Explorer',
    slideLabel: 'Interactive 3D Map',
    component: MallExplorer3D as React.ComponentType<Record<string, unknown>>,
  },
]

// ── Persona Journey Definitions ───────────────────────────────────────────────

export const PERSONA_CONFIGS: Record<Persona, PersonaConfig> = {
  retailer: {
    label: 'Retailer',
    color: '#c9a84c',   // gold
    journey: [
      'opportunity',       // branch point (stays visible)
      'catchment',         // your customer base
      'scale',             // 40M visitors, $245 spend, 3.2x conversion
      'audience',          // $104K+ HHI, demographics
      'luxury',            // premium retail context & neighbors
      'dining',            // high-dwell ecosystem
      'leasing-intro',     // "Your Brand. 40M Customers."
      'mall-layout',       // where would you be
      'leasing-formats',   // flagship, pop-up, kiosk options
      'cta',               // let's talk leasing
      'mall-3d',           // explore in 3D
    ],
  },
  sponsor: {
    label: 'Brand Sponsor',
    color: '#4a9eff',   // blue
    journey: [
      'opportunity',         // branch point
      'audience',            // the audience you'd own
      'catchment',           // geographic reach
      'scale',               // raw platform numbers
      'attractions',         // see category ownership in action
      'sponsorship-intro',   // "40M People. Your Brand."
      'existing-partners',   // social proof — Coca-Cola, LEGO etc.
      'partnership-tiers',   // deal structure
      'events',              // activation platform
      'cta',                 // let's structure your partnership
      'mall-3d',             // see where your brand would live
    ],
  },
  organizer: {
    label: 'Event Organizer',
    color: '#00b4a0',   // teal
    journey: [
      'opportunity',       // branch point
      'events',            // what events happen here
      'venue-summary',     // all 7 venues
      'venue-detail',      // individual venue specs
      'attractions',       // unique activations (ski slope, waterpark, theme park)
      'catchment',         // who will attend
      'audience',          // attendee demographics
      'event-history',     // proof it works
      'dining',            // F&B for events
      'scale',             // validation numbers
      'cta',               // let's book
      'mall-3d',           // explore the spaces
    ],
  },
}

// ── Utility ───────────────────────────────────────────────────────────────────

function buildChapters(): ChapterGroup[] {
  const map = new Map<string, number[]>()
  SLIDES.forEach((slide, i) => {
    if (!map.has(slide.chapterLabel)) map.set(slide.chapterLabel, [])
    map.get(slide.chapterLabel)!.push(i)
  })
  return Array.from(map.entries()).map(([label, slideIndices]) => ({
    label,
    slideIndices,
  }))
}

const CHAPTERS = buildChapters()

// ── Context ───────────────────────────────────────────────────────────────────

const DeckContext = createContext<DeckContextType | null>(null)

export function useDeck(): DeckContextType {
  const ctx = useContext(DeckContext)
  if (!ctx) throw new Error('useDeck must be used within DeckEngine')
  return ctx
}

export function useDeckSafe(): DeckContextType | null {
  return useContext(DeckContext)
}

// ── DeckEngine ────────────────────────────────────────────────────────────────

export default function DeckEngine() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [direction, setDirection] = useState<number>(1)
  const [persona, setPersonaState] = useState<Persona | null>(null)

  // Derive the active persona config
  const personaConfig = persona ? PERSONA_CONFIGS[persona] : null

  // ── Core navigate-by-index (always works on SLIDES array) ──────────────────
  const goTo = useCallback(
    (n: number) => {
      const clamped = Math.max(0, Math.min(n, SLIDES.length - 1))
      setDirection(clamped >= currentSlide ? 1 : -1)
      setCurrentSlide(clamped)
    },
    [currentSlide]
  )

  const goToSlideById = useCallback(
    (id: string) => {
      const idx = SLIDES.findIndex(s => s.id === id)
      if (idx !== -1) goTo(idx)
    },
    [goTo]
  )

  // ── Journey-aware next / prev ──────────────────────────────────────────────
  const next = useCallback(() => {
    if (personaConfig) {
      const journey = personaConfig.journey
      const currentId = SLIDES[currentSlide].id
      const pos = journey.indexOf(currentId)
      if (pos !== -1 && pos < journey.length - 1) {
        goToSlideById(journey[pos + 1])
      } else {
        // Fallen off the journey — just go to next global slide
        goTo(currentSlide + 1)
      }
    } else {
      goTo(currentSlide + 1)
    }
  }, [currentSlide, personaConfig, goTo, goToSlideById])

  const prev = useCallback(() => {
    if (personaConfig) {
      const journey = personaConfig.journey
      const currentId = SLIDES[currentSlide].id
      const pos = journey.indexOf(currentId)
      if (pos > 0) {
        goToSlideById(journey[pos - 1])
      } else {
        goTo(currentSlide - 1)
      }
    } else {
      goTo(currentSlide - 1)
    }
  }, [currentSlide, personaConfig, goTo, goToSlideById])

  // ── Persona setters ────────────────────────────────────────────────────────
  const setPersona = useCallback((p: Persona) => {
    setPersonaState(p)
  }, [])

  const clearPersona = useCallback(() => {
    setPersonaState(null)
  }, [])

  // ── Journey step tracking ─────────────────────────────────────────────────
  const currentId = SLIDES[currentSlide].id
  const journeyStep = personaConfig
    ? Math.max(0, personaConfig.journey.indexOf(currentId))
    : 0
  const journeyTotal = personaConfig ? personaConfig.journey.length : 0

  // ── Keyboard navigation ────────────────────────────────────────────────────
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next()
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') prev()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [next, prev])

  // ── Touch swipe navigation ─────────────────────────────────────────────────
  useEffect(() => {
    let startX = 0
    let startY = 0

    const onTouchStart = (e: TouchEvent) => {
      const tag = (e.target as HTMLElement)?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return
      startX = e.touches[0].clientX
      startY = e.touches[0].clientY
    }

    const onTouchEnd = (e: TouchEvent) => {
      const tag = (e.target as HTMLElement)?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return

      const dx = e.changedTouches[0].clientX - startX
      const dy = e.changedTouches[0].clientY - startY
      const THRESHOLD = 50 // minimum px to register as a swipe

      // Only trigger if horizontal movement dominates (not a scroll)
      if (Math.abs(dx) > THRESHOLD && Math.abs(dx) > Math.abs(dy)) {
        if (dx < 0) next()   // swipe left  → next slide
        else        prev()   // swipe right → prev slide
      }
    }

    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchend', onTouchEnd, { passive: true })
    return () => {
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchend', onTouchEnd)
    }
  }, [next, prev])

  const ctx: DeckContextType = {
    currentSlide,
    totalSlides: SLIDES.length,
    slides: SLIDES,
    chapters: CHAPTERS,
    direction,
    persona,
    personaConfig,
    journeyStep,
    journeyTotal,
    setPersona,
    clearPersona,
    goTo,
    next,
    prev,
    goToSlideById,
  }

  const ActiveComp = SLIDES[currentSlide].component

  // ── Persona progress bar width ─────────────────────────────────────────────
  const progressWidth = persona
    ? `${(journeyStep / Math.max(journeyTotal - 1, 1)) * 100}%`
    : `${(currentSlide / (SLIDES.length - 1)) * 100}%`

  const progressColor = personaConfig?.color ?? 'var(--color-gold)'

  return (
    <DeckContext.Provider value={ctx}>
      <div className="deck">
        {/* Persona-aware progress bar */}
        <div
          className="deck-progress"
          style={{ width: progressWidth, background: progressColor }}
        />

        {/* Persona top bar — colored stripe when journey is active */}
        {personaConfig && (
          <div
            className="deck-persona-bar"
            style={{ background: personaConfig.color }}
          />
        )}

        {/* Top bar + drawer + arrows */}
        <DeckNav />

        {/* Active slide */}
        <AnimatePresence mode="wait" custom={direction}>
          <DeckSlide key={currentSlide}>
            <ActiveComp
              onNext={next}
              onSkipIntro={next}
              goToSlideById={goToSlideById}
            />
          </DeckSlide>
        </AnimatePresence>
      </div>
    </DeckContext.Provider>
  )
}

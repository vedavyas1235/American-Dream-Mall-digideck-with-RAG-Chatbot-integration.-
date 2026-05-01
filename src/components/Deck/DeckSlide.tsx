import { useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useDeck } from './DeckEngine'

// Directional slide + fade variants
// custom = direction: 1 (forward) | -1 (backward)
const variants = {
  enter: (dir: number) => ({
    opacity: 0,
    x: dir > 0 ? 60 : -60,
  }),
  center: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.52,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  },
  exit: (dir: number) => ({
    opacity: 0,
    x: dir > 0 ? -40 : 40,
    transition: { duration: 0.28, ease: 'easeIn' as const },
  }),
}

// Gold sweep line — plays once per transition
const sweepVariants = {
  enter: { scaleX: 0, opacity: 1, originX: 0 },
  center: {
    scaleX: [0, 1, 1, 0],
    opacity: [1, 1, 1, 0],
    originX: [0, 0, 1, 1],
    transition: { duration: 0.52, ease: 'easeInOut' as const, times: [0, 0.4, 0.6, 1] },
  },
  exit: { opacity: 0 },
}

interface DeckSlideProps {
  children: React.ReactNode
}

export default function DeckSlide({ children }: DeckSlideProps) {
  const { direction } = useDeck()
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = 0
    }
  }, [])

  return (
    <>
      {/* Gold sweep line — cinematic transition accent */}
      <motion.div
        className="deck-sweep-line"
        custom={direction}
        variants={sweepVariants}
        initial="enter"
        animate="center"
        exit="exit"
      />

      <motion.div
        ref={containerRef}
        className="deck-slide-wrapper"
        custom={direction}
        variants={variants}
        initial="enter"
        animate="center"
        exit="exit"
      >
        {children}
      </motion.div>
    </>
  )
}

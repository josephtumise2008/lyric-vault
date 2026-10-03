import { AnimatePresence, motion } from 'framer-motion'
import { Suspense } from 'react'
import { Outlet, useLocation } from 'react-router-dom'

import { pageVariants, useMotionPrefs } from '../lib/motion'

import { Footer } from './Footer'
import { GrainOverlay } from './GrainOverlay'
import { Navbar } from './Navbar'
import { ScrollToTop } from './ScrollToTop'

function RouteFallback() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center" role="status">
      <span className="type-accent text-xs uppercase tracking-[0.24em] text-muted-dim">
        Loading
      </span>
    </div>
  )
}

/**
 * Persistent chrome: skip link, fixed nav, animated outlet, footer.
 *
 * The outlet is keyed on the pathname so `AnimatePresence` can cross-fade
 * between pages without any page needing to know about transitions.
 */
export function RootLayout() {
  const location = useLocation()
  const { still } = useMotionPrefs()

  return (
    <div className="flex min-h-dvh flex-col bg-ink">
      <ScrollToTop />
      <Navbar />

      <main id="main" className="flex-1">
        <Suspense fallback={<RouteFallback />}>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={location.pathname}
              variants={still ? undefined : pageVariants}
              initial={still ? false : 'hidden'}
              animate="visible"
              exit={still ? undefined : 'exit'}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </Suspense>
      </main>

      <Footer />
      <GrainOverlay />
    </div>
  )
}

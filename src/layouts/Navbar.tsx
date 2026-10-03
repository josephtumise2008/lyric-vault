import { AnimatePresence, motion } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'

import { ARTIST_NAME, navLinks, socials } from '../content'
import { useFocusTrap } from '../hooks/useFocusTrap'
import { useLockBodyScroll } from '../hooks/useLockBodyScroll'
import { cn } from '../lib/cn'
import { EASE, useMotionPrefs } from '../lib/motion'

import { Button } from '../components/Button'
import { SocialLinks } from '../components/SocialLinks'

function Wordmark() {
  return (
    <span className="flex items-baseline gap-1.5">
      <span className="font-display text-lg leading-none tracking-wide text-bone sm:text-xl">
        {ARTIST_NAME}
      </span>
      <span aria-hidden="true" className="size-1.5 rounded-full bg-blood" />
    </span>
  )
}

/**
 * Sticky, mobile-first navigation.
 *
 * Desktop shows the full bar; below `lg` an animated drawer takes over. The
 * drawer traps focus, locks page scroll and closes on Escape.
 */
export function Navbar() {
  const location = useLocation()
  const { still } = useMotionPrefs()
  const [scrolled, setScrolled] = useState(false)
  /**
   * The route the drawer was opened on.
   *
   * Storing the pathname instead of a boolean means a navigation closes the
   * drawer through ordinary derivation — no effect needed to reset it.
   */
  const [openedOn, setOpenedOn] = useState<string | null>(null)
  const open = openedOn === location.pathname

  const close = useCallback(() => setOpenedOn(null), [])
  const toggle = useCallback(
    () => setOpenedOn((current) => (current === location.pathname ? null : location.pathname)),
    [location.pathname],
  )

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useLockBodyScroll(open)

  const drawerRef = useFocusTrap<HTMLDivElement>(open, close)

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-60 focus:bg-blood focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-bone"
      >
        Skip to content
      </a>

      <header
        className={cn(
          'fixed inset-x-0 top-0 z-50 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]',
          scrolled || open
            ? 'border-b border-line bg-ink/90 backdrop-blur-xl'
            : 'border-b border-transparent bg-transparent',
        )}
      >
        <nav aria-label="Primary" className="shell flex h-16 items-center justify-between gap-4 sm:h-20">
          <Link to="/" aria-label={`${ARTIST_NAME} — home`} className="shrink-0 rounded-sm">
            <Wordmark />
          </Link>

          <ul className="hidden items-center gap-0.5 lg:flex">
            {navLinks.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  end={link.to === '/'}
                  className={({ isActive }) =>
                    cn(
                      'relative block px-3 py-2 text-[0.6875rem] font-semibold uppercase tracking-[0.18em] transition-colors duration-300',
                      isActive ? 'text-bone' : 'text-muted hover:text-bone',
                    )
                  }
                >
                  {({ isActive }) => (
                    <>
                      {link.label}
                      {isActive && (
                        <motion.span
                          layoutId="nav-active"
                          aria-hidden="true"
                          className="absolute inset-x-3 -bottom-0.5 h-px bg-blood"
                          transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                        />
                      )}
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2 sm:gap-3">
            <SocialLinks links={socials.slice(0, 1)} className="hidden sm:flex" />

            <Button to="/music" variant="primary" size="sm" className="hidden sm:inline-flex">
              Listen
            </Button>

            <button
              type="button"
              onClick={toggle}
              aria-expanded={open}
              aria-controls="mobile-nav"
              aria-label={open ? 'Close menu' : 'Open menu'}
              className="flex size-10 items-center justify-center rounded-[2px] border border-line text-bone transition-colors duration-300 hover:border-blood lg:hidden"
            >
              {open ? <X aria-hidden="true" className="size-5" /> : <Menu aria-hidden="true" className="size-5" />}
            </button>
          </div>
        </nav>

        <AnimatePresence>
          {open && (
            <motion.div
              key="mobile-nav"
              initial={still ? { opacity: 1 } : { opacity: 0, height: 0 }}
              animate={still ? { opacity: 1 } : { opacity: 1, height: 'auto' }}
              exit={still ? { opacity: 1 } : { opacity: 0, height: 0 }}
              transition={{ duration: still ? 0 : 0.4, ease: EASE }}
              className="overflow-hidden border-t border-line bg-ink/95 backdrop-blur-xl lg:hidden"
            >
              <div
                ref={drawerRef}
                id="mobile-nav"
                tabIndex={-1}
                className="max-h-[calc(100dvh-4rem)] overflow-y-auto pb-6"
              >
                <ul className="shell flex flex-col divide-y divide-line-soft py-2">
                  {navLinks.map((link, index) => (
                    <motion.li
                      key={link.to}
                      initial={still ? false : { opacity: 0, x: -14 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: still ? 0 : 0.05 + index * 0.04, duration: 0.35 }}
                    >
                      <NavLink
                        to={link.to}
                        end={link.to === '/'}
                        className={({ isActive }) =>
                          cn(
                            'flex items-center justify-between py-4 font-display text-2xl transition-colors',
                            isActive ? 'text-blood' : 'text-bone hover:text-blood',
                          )
                        }
                      >
                        {link.label}
                        <span className="type-accent text-[0.6875rem] text-muted-dim">
                          {String(index + 1).padStart(2, '0')}
                        </span>
                      </NavLink>
                    </motion.li>
                  ))}
                </ul>

                <div className="shell flex flex-col gap-5 border-t border-line pt-5">
                  <Button to="/music" variant="primary">
                    Listen
                  </Button>
                  <SocialLinks links={socials} layout="labels" />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  )
}

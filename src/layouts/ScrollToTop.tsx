import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * Jumps to the top of the page on navigation.
 *
 * Deliberately instant — the router's page transition covers visual continuity,
 * and a smooth scroll would fight it.
 */
export function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  }, [pathname])

  return null
}

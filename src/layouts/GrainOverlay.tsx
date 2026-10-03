/**
 * Fixed film-grain + vignette layer.
 *
 * Sits above the page content but never intercepts clicks or focus, so it
 * cannot get in the way of an interactive element.
 */
export function GrainOverlay() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-40">
      <div className="grain absolute inset-0 opacity-[0.035] mix-blend-overlay" />
      <div className="absolute inset-0 bg-[radial-gradient(125%_90%_at_50%_0%,transparent_55%,rgba(5,5,6,0.6)_100%)]" />
    </div>
  )
}

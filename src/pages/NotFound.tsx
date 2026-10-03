import { Home, Music } from 'lucide-react'
import { Link } from 'react-router-dom'

import { ARTIST_NAME, navLinks } from '../content'

import { TornEdge, VinylArt } from '../components/art/Doodles'
import { Button } from '../components/Button'
import { Seo } from '../components/Seo'

export default function NotFound() {
  return (
    <>
      <Seo
        title="Page not found"
        description={`That page does not exist on the ${ARTIST_NAME} site.`}
        path="/404"
        noIndex
      />

      <div className="relative flex min-h-[80vh] items-center overflow-hidden py-32">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_60%_at_50%_40%,rgba(211,18,42,0.18),transparent_70%)]"
        />
        <div aria-hidden="true" className="halftone absolute inset-0 opacity-20" />

        <div className="shell relative text-center">
          <VinylArt className="mx-auto h-24 w-24 text-blood/40" />

          <p className="kicker mt-8">Error 404</p>

          <h1 className="mt-4 text-[clamp(4rem,18vw,10rem)] leading-[0.85] text-bone">
            Track
            <span className="text-blood">.</span>
            <span className="block text-[clamp(2rem,7vw,3.5rem)] text-muted">Not found</span>
          </h1>

          <p className="mx-auto mt-7 max-w-md text-[0.9375rem] leading-relaxed text-muted">
            This side is scratched. The page you asked for is not here — nothing on this site was
            lost, it just moved.
          </p>

          <TornEdge className="mx-auto my-8 h-4 w-full max-w-md text-line" />

          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button to="/" variant="primary">
              <Home aria-hidden="true" className="size-4" />
              Back home
            </Button>
            <Button to="/music" variant="outline">
              <Music aria-hidden="true" className="size-4" />
              Listen instead
            </Button>
          </div>

          <nav aria-label="Site pages" className="mt-12">
            <p className="kicker">Or try</p>
            <ul className="mt-4 flex flex-wrap justify-center gap-x-5 gap-y-2">
              {navLinks
                .filter((link) => link.to !== '/')
                .map((link) => (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      className="link-underline text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-muted hover:text-bone"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
            </ul>
          </nav>
        </div>
      </div>
    </>
  )
}

import { ArrowUp } from 'lucide-react'
import { Link } from 'react-router-dom'

import { ARTIST_NAME, artist, credit, footerLinks, socials } from '../content'

import { SocialLinks } from '../components/SocialLinks'

function BackToTop() {
  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="group flex items-center gap-2 text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-muted transition-colors hover:text-bone"
    >
      Back to top
      <span className="flex size-8 items-center justify-center rounded-[2px] border border-line transition-all duration-300 group-hover:border-blood group-hover:text-blood">
        <ArrowUp aria-hidden="true" className="size-3.5" />
      </span>
    </button>
  )
}

/** Shared footer — identical on every page. */
export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="relative overflow-hidden border-t border-line bg-ink-deep">
      {/* Oversized wordmark cropped by the viewport edge — magazine masthead. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 -bottom-4 select-none overflow-hidden sm:-bottom-6"
      >
        <p className="whitespace-nowrap text-center font-display leading-none tracking-tight text-bone/[0.05] text-[19vw]">
          {ARTIST_NAME}
        </p>
      </div>

      <div className="shell relative pb-10 pt-16 sm:pt-20">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <p className="font-display text-3xl leading-none text-bone sm:text-4xl">
              {ARTIST_NAME}
            </p>
            <p className="type-accent mt-4 max-w-sm text-sm leading-relaxed text-muted">
              {artist.tagline}
            </p>
            <SocialLinks links={socials} className="mt-7" />
          </div>

          <nav aria-label="Footer">
            <h2 className="kicker mb-5">Sections</h2>
            <ul className="space-y-3">
              {footerLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="link-underline text-sm text-muted transition-colors hover:text-bone"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="kicker mb-5">Enquiries</h2>
            <ul className="space-y-3 text-sm">
              <li>
                <a
                  href={`mailto:${artist.email}`}
                  className="link-underline text-muted transition-colors hover:text-bone"
                >
                  {artist.email}
                </a>
              </li>
              <li className="text-muted-dim">{artist.origin}</li>
              <li>
                <Link
                  to="/press"
                  className="link-underline text-muted transition-colors hover:text-bone"
                >
                  Press kit
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-5 border-t border-line pt-7 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-muted-dim">
            © {year} {ARTIST_NAME}. All rights reserved.
          </p>
          <div className="flex items-center gap-5">
            {credit.designer && (
              <p className="type-accent text-xs text-muted-dim">
                Site by{' '}
                {credit.designerUrl ? (
                  <a
                    href={credit.designerUrl}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="link-underline text-muted"
                  >
                    {credit.designer}
                  </a>
                ) : (
                  credit.designer
                )}
              </p>
            )}
            <BackToTop />
          </div>
        </div>
      </div>
    </footer>
  )
}

import type { ReactElement } from 'react'

const stroke = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.7,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
} as const

const InstagramMark = () => (
  <>
    <rect x="3" y="3" width="18" height="18" rx="5.2" {...stroke} />
    <circle cx="12" cy="12" r="4.1" {...stroke} />
    <circle cx="17.2" cy="6.8" r="1.15" fill="currentColor" />
  </>
)

const YoutubeMark = () => (
  <path
    fillRule="evenodd"
    clipRule="evenodd"
    fill="currentColor"
    d="M2.6 8.4a3 3 0 0 1 3-3h12.8a3 3 0 0 1 3 3v7.2a3 3 0 0 1-3 3H5.6a3 3 0 0 1-3-3V8.4Zm7.6 1.1v5l4.6-2.5-4.6-2.5Z"
  />
)

const TikTokMark = () => (
  <path
    fill="currentColor"
    d="M13.6 2.5h2.7c.3 2.2 1.7 3.7 4 3.9v2.6a6.6 6.6 0 0 1-4-1.4v5.6a5.9 5.9 0 1 1-5.9-5.9c.3 0 .6 0 .9.1v2.7a3.2 3.2 0 1 0 2.3 3.1V2.5Z"
  />
)

const SpotifyMark = () => (
  <>
    <circle cx="12" cy="12" r="9" {...stroke} />
    <path d="M7.3 9.5c3.1-1 6.7-.8 9.4.9" {...stroke} />
    <path d="M8.1 12.8c2.4-.8 5.1-.6 7.3.6" {...stroke} />
    <path d="M8.9 15.9c1.8-.6 3.8-.5 5.6.4" {...stroke} />
  </>
)

const AppleMusicMark = () => (
  <>
    <rect x="2.8" y="2.8" width="18.4" height="18.4" rx="5.4" {...stroke} />
    <path d="M10 17.4V8.9l6-1.2v6.6" {...stroke} />
    <circle cx="8.5" cy="17.4" r="1.6" fill="currentColor" />
    <circle cx="14.5" cy="16.3" r="1.6" fill="currentColor" />
  </>
)

const SoundCloudMark = () => (
  <>
    <path d="M3 13.6v3.2M6 12.2v4.6M9 10.6v6.2M12 9v7.8" {...stroke} />
    <path d="M15 16.8h4.1a3 3 0 0 0 .4-6 4.6 4.6 0 0 0-8.6-1.5" {...stroke} />
  </>
)

const BandcampMark = () => (
  <path
    fillRule="evenodd"
    clipRule="evenodd"
    fill="currentColor"
    d="M2.4 2.4h9.4c5.2 0 9.8 3.4 9.8 7.6s-4.6 7.6-9.8 7.6v3H2.4V2.4Zm0 9.2h9.2c1.1 0 1.9-.6 1.9-1.6s-.8-1.6-1.9-1.6H2.4v3.2Z"
  />
)

const XMark = () => <path d="M4 4l7.4 8.6L4.4 20M20 4l-7.5 8.1L19.6 20" {...stroke} />

const MARKS: Record<string, () => ReactElement> = {
  Instagram: InstagramMark,
  TikTok: TikTokMark,
  YouTube: YoutubeMark,
  Spotify: SpotifyMark,
  'Apple Music': AppleMusicMark,
  SoundCloud: SoundCloudMark,
  Bandcamp: BandcampMark,
  X: XMark,
  Facebook: InstagramMark,
}

type BrandIconProps = {
  /** Any platform name; unknown names fall back to a neutral mark. */
  platform: string
  className?: string
}

/**
 * Brand marks drawn as one consistent set.
 *
 * lucide v1 no longer ships brand glyphs, and mixing real logos with generic
 * icons looks accidental — so each social icon here is a simplified geometric
 * mark drawn to the same weight.
 */
export function BrandIcon({ platform, className }: BrandIconProps) {
  const Mark = MARKS[platform] ?? InstagramMark
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" className={className}>
      <Mark />
    </svg>
  )
}

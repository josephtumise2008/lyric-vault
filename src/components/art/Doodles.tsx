/**
 * Original decorative artwork.
 *
 * Everything here is drawn from scratch with plain SVG paths: a cassette tape, a
 * record, a boombox, a microphone, halftone dots, a torn paper edge and a
 * street-flyer flourish. No third-party logos, no copyrighted characters, no
 * traced artwork — these are generic objects, drawn simply on purpose.
 */

import type { ReactNode } from 'react'

type ArtProps = {
  className?: string
}

type SvgProps = ArtProps & {
  children: ReactNode
  strokeWidth?: number
  viewBox?: string
}

/** Shared shell: all artwork here is decorative, so it is always aria-hidden. */
function Svg({ className, children, strokeWidth = 2, viewBox = '0 0 120 80' }: SvgProps) {
  return (
    <svg
      viewBox={viewBox}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      {children}
    </svg>
  )
}

/* -------------------------------------------------------------------------- */
/* Cassette tape                                                               */
/* -------------------------------------------------------------------------- */

export function CassetteArt({ className }: ArtProps) {
  return (
    <Svg className={className} strokeWidth={2}>
      <rect x="4" y="14" width="112" height="52" rx="6" />
      <path d="M14 34h92v22H14z" />
      <circle cx="40" cy="45" r="9" />
      <circle cx="80" cy="45" r="9" />
      <circle cx="40" cy="45" r="3" />
      <circle cx="80" cy="45" r="3" />
      <path d="M20 24h22M78 24h22" />
      <path d="M26 14l6 20M94 14l-6 20" />
      <path d="M52 74v-8h16v8" />
      <path d="M30 66v8M90 66v8" />
    </Svg>
  )
}

/* -------------------------------------------------------------------------- */
/* Vinyl record                                                                */
/* -------------------------------------------------------------------------- */

export function VinylArt({ className }: ArtProps) {
  return (
    <Svg className={className} strokeWidth={2}>
      <circle cx="60" cy="40" r="34" />
      <circle cx="60" cy="40" r="24" />
      <circle cx="60" cy="40" r="13" />
      <circle cx="60" cy="40" r="3.5" />
      <path d="M60 6a34 34 0 0 1 20 6.6" />
      <path d="M86 58a34 34 0 0 1-18 15.6" />
      <path d="M34 26a34 34 0 0 1 10-11" />
      <path d="M40 52a34 34 0 0 0 6 10" />
    </Svg>
  )
}

/* -------------------------------------------------------------------------- */
/* Boombox                                                                     */
/* -------------------------------------------------------------------------- */

export function BoomboxArt({ className }: ArtProps) {
  return (
    <Svg className={className} strokeWidth={2}>
      <rect x="8" y="22" width="104" height="46" rx="5" />
      <circle cx="34" cy="45" r="13" />
      <circle cx="86" cy="45" r="13" />
      <circle cx="34" cy="45" r="4" />
      <circle cx="86" cy="45" r="4" />
      <path d="M60 32h16v10H60z" />
      <path d="M64 42v6M72 42v6" />
      <circle cx="52" cy="60" r="3" />
      <circle cx="68" cy="60" r="3" />
      <path d="M18 22l6-10h14" />
      <path d="M102 22l-6-10H82" />
      <path d="M28 68v6M92 68v6" />
    </Svg>
  )
}

/* -------------------------------------------------------------------------- */
/* Microphone                                                                  */
/* -------------------------------------------------------------------------- */

export function MicrophoneArt({ className }: ArtProps) {
  return (
    <Svg className={className} strokeWidth={2}>
      <rect x="48" y="6" width="24" height="42" rx="12" />
      <path d="M36 38a24 24 0 0 0 48 0" />
      <path d="M60 62v12" />
      <path d="M46 74h28" />
      <path d="M48 16h24M48 26h24M48 36h24" />
    </Svg>
  )
}

/* -------------------------------------------------------------------------- */
/* Graffiti-style arrow / flourish (original, generic)                          */
/* -------------------------------------------------------------------------- */

export function FlourishArt({ className }: ArtProps) {
  return (
    <Svg className={className} strokeWidth={2.5}>
      <path d="M6 58c14-22 30-30 48-24s22 26 40 20 16-20 20-28" />
      <path d="M96 20l18 6-6 18" />
      <path d="M14 66c12 6 26 6 38 0" />
    </Svg>
  )
}

/** Speech-bubble outline used by the collection section. */
export function SpeechBubbleArt({ className }: ArtProps) {
  return (
    <Svg className={className} strokeWidth={2}>
      <path d="M10 12h100a4 4 0 0 1 4 4v44a4 4 0 0 1-4 4H58L38 76l4-12H10a4 4 0 0 1-4-4V16a4 4 0 0 1 4-4Z" />
      <path d="M24 30h72M24 42h52" />
    </Svg>
  )
}

/* -------------------------------------------------------------------------- */
/* Textures                                                                    */
/* -------------------------------------------------------------------------- */

/** Torn-paper top edge — sits above a section as a print artefact. */
export function TornEdge({ className }: ArtProps) {
  return (
    <svg
      viewBox="0 0 1200 24"
      preserveAspectRatio="none"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M0 0h1200v9l-38 6-44-9-40 10-46-8-52 9-38-7-50 10-44-9-48 8-40-10-52 9-46-8-44 10-42-9-50 8-46-9-48 10-42-8z"
        fill="currentColor"
      />
    </svg>
  )
}

/** Corner registration marks — press-kit / flyer cue. */
export function CropMarks({ className }: ArtProps) {
  return (
    <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1" aria-hidden="true" className={className}>
      <path d="M0 12V0h12M28 0h12v12M40 28v12H28M12 40H0V28" />
    </svg>
  )
}

/** Two crossed cassette screws — used as a small divider ornament. */
export function DividerOrnament({ className }: ArtProps) {
  return (
    <Svg viewBox="0 0 64 12" strokeWidth={1} className={className}>
      <path d="M2 6h22" />
      <path d="M40 6h22" />
      <path d="M32 1.5l4.5 4.5L32 10.5 27.5 6 32 1.5Z" />
    </Svg>
  )
}

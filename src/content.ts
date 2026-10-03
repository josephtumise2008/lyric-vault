/* ==========================================================================
   src/content.ts — EVERY ARTIST-SPECIFIC VALUE LIVES HERE
   ==========================================================================

   THE WORKFLOW
   ------------
   1. Drop the file into the matching folder inside `public/`:

        public/images/            hero, about, og-image
        public/images/gallery/    gallery photographs
        public/images/collection/ collection photographs
        public/images/covers/     release artwork
        public/images/press/      press photographs
        public/audio/             full songs
        public/audio/clips/       short studio clips
        public/videos/            videos
        public/press/             one-sheet.pdf and other PDFs

   2. Add ONE entry to the array below that already describes it.

   3. Save. The site picks it up — no component edits, ever.

   `HOW TO UPDATE.md` walks through this for every type of content.

   --------------------------------------------------------------------------
   RULES THAT KEEP THIS FILE HONEST
   --------------------------------------------------------------------------
   • Invented facts are not allowed. Where a real detail is missing it is left
     empty and the section hides itself rather than making something up.
   • Lyrics belong to the artist. Until they are supplied, every track carries
     LYRICS_PENDING as its lyric body.
   • Statistics, press coverage and shows are never fabricated — those arrays
     start empty and the UI adapts.
   ========================================================================== */

/* --------------------------------------------------------------------------
   THE ARTIST NAME — defined once, imported everywhere
   -------------------------------------------------------------------------- */

export const ARTIST_NAME = 'BeatBoy'

/** Placeholder body used for every lyric that has not been supplied yet. */
export const LYRICS_PENDING = '[ARTIST TO PROVIDE LYRICS]'

/** Marks copy that is still standing in for the real thing. */
export const PLACEHOLDER = 'PLACEHOLDER'

/* --------------------------------------------------------------------------
   Types
   -------------------------------------------------------------------------- */

import type {
  BookingInfo,
  CollectionItem,
  ImageItem,
  NextDrop,
  PressPhoto,
  PressQuote,
  Release,
  Show,
  SiteSeo,
  Song,
  SocialLink,
  VideoItem,
} from './types'

/* --------------------------------------------------------------------------
   Artist
   -------------------------------------------------------------------------- */

export const artist = {
  name: ARTIST_NAME,
  /** Short hook used on the homepage hero and link-in-bio page. */
  tagline: 'Old-school rap. Made by hand.',
  subTagline: "70s and 80s inspired hip-hop from the USA.",
  genre: 'Old-School Rap',
  origin: 'USA',
  label: 'Independent',
  /**
   * These bios are stand-ins. Replace them with the artist's real words —
   * do not publish invented biography.
   */
  bioShort: `${PLACEHOLDER} — one sentence: who he is and what the music sounds like.`,
  bioLong: [
    `${PLACEHOLDER} — three or four sentences. Where he started, what shaped the sound, and what he is working on now.`,
    `${PLACEHOLDER} — a second paragraph covering the live show, the process, or the influences that matter most.`,
  ],
  email: 'beatboy@example.com',
  bookingEmail: 'booking@beatboy.example',
  pressEmail: 'press@beatboy.example',
  /** The hero photograph. Framed, never stretched — see components/MediaCard. */
  heroImage: '/images/hero.jpg',
  heroAlt: 'BeatBoy photographed for the site',
  aboutImage: '/images/about.jpg',
  aboutAlt: 'BeatBoy photographed for the about page',
} as const

/* --------------------------------------------------------------------------
   Social
   -------------------------------------------------------------------------- */

export const socials: SocialLink[] = [
  {
    id: 'social-instagram',
    platform: 'Instagram',
    handle: '@djbutterfingers7',
    url: 'https://instagram.com/djbutterfingers7',
    primary: true,
  },
  {
    // Unverified — confirm this link is correct before publishing.
    id: 'social-soundcloud',
    platform: 'SoundCloud',
    handle: 'SoundCloud',
    url: 'https://on.soundcloud.com/DLYEluVAeKiLJ2r37o',
    primary: true,
  },
]

/** Optional SoundCloud embed on the music page. Leave blank to hide it. */
export const soundcloudTrackUrl = ''

/* --------------------------------------------------------------------------
   Songs
   -------------------------------------------------------------------------- */

/**
 * Three placeholder tracks. Rename them, swap the audio, and replace
 * LYRICS_PENDING with the real words once they are supplied.
 */
export const songs: Song[] = [
  {
    id: 'song-01',
    slug: 'untitled-song-01',
    title: 'Untitled Song 01',
    subtitle: PLACEHOLDER,
    releaseType: 'Single',
    audio: '/audio/full-song.mp3',
    artwork: '/images/covers/untitled-song-01.jpg',
    lyricsSlug: 'untitled-song-01',
    description: `${PLACEHOLDER} — one or two sentences about the track.`,
    story: `${PLACEHOLDER} — the story behind the song, or leave it out.`,
    tags: ['Old-School', 'Rap'],
    credits: [`Written and performed by ${ARTIST_NAME}`],
    isPlaceholder: true,
  },
  {
    id: 'song-02',
    slug: 'untitled-song-02',
    title: 'Untitled Song 02',
    subtitle: PLACEHOLDER,
    releaseType: 'Single',
    audio: '/audio/clips/snippet-01.mp3',
    artwork: '/images/covers/untitled-song-02.jpg',
    lyricsSlug: 'untitled-song-02',
    description: `${PLACEHOLDER} — one or two sentences about the track.`,
    story: `${PLACEHOLDER} — the story behind the song, or leave it out.`,
    tags: ['Old-School', 'Rap'],
    credits: [`Written and performed by ${ARTIST_NAME}`],
    isPlaceholder: true,
  },
  {
    id: 'song-03',
    slug: 'untitled-song-03',
    title: 'Untitled Song 03',
    subtitle: PLACEHOLDER,
    releaseType: 'Single',
    audio: '/audio/clips/snippet-02.mp3',
    artwork: '/images/covers/untitled-song-03.jpg',
    lyricsSlug: 'untitled-song-03',
    description: `${PLACEHOLDER} — one or two sentences about the track.`,
    tags: ['Old-School', 'Rap'],
    credits: [`Written and performed by ${ARTIST_NAME}`],
    isPlaceholder: true,
  },
]

/** Newest first — drives "Fresh Lyrics" on the homepage. */
export const latestSong: Song | undefined = songs[0]

/* --------------------------------------------------------------------------
   Lyrics
   -------------------------------------------------------------------------- */

export type Lyric = {
  songSlug: string
  title: string
  release: string
  year: string
  /** Free-text lyrics. Section headers use [Bracketed] lines. */
  lines: string[]
  story?: string
  tags?: string[]
  /** False until the artist supplies the real words. */
  isComplete: boolean
  isPlaceholder?: boolean
}

export const lyrics: Lyric[] = songs.map((song) => ({
  songSlug: song.slug,
  title: song.title,
  release: song.releaseType,
  year: '',
  lines: [LYRICS_PENDING],
  story: song.story,
  tags: song.tags,
  isComplete: false,
  isPlaceholder: true,
}))

/** Tags offered as filters on /lyrics. Derived, so they can never go stale. */
export const lyricTags: string[] = [...new Set(lyrics.flatMap((l) => l.tags ?? []))].sort()

/* --------------------------------------------------------------------------
   Releases
   -------------------------------------------------------------------------- */

export const releases: Release[] = [
  {
    id: 'release-01',
    slug: 'untitled-song-01',
    title: 'Untitled Song 01',
    type: 'Single',
    description: `${PLACEHOLDER} — describe the release.`,
    artwork: '/images/covers/untitled-song-01.jpg',
    tracklist: [{ title: 'Untitled Song 01', audio: '/audio/full-song.mp3' }],
    credits: [`Written and performed by ${ARTIST_NAME}`],
    isPlaceholder: true,
  },
]

/** Drives the "Latest Release" block on the homepage. */
export const latestRelease: Release | undefined = releases[0]

/* --------------------------------------------------------------------------
   Studio clips
   -------------------------------------------------------------------------- */

/**
 * Short excerpts for the /music page. These render as "Studio Clip 01…06" with
 * no invented titles — the label comes from `label`, the file from `audio`.
 */
export const studioClips: Array<{ id: string; label: string; audio: string }> = [
  { id: 'clip-01', label: 'Studio Clip 01', audio: '/audio/clips/snippet-01.mp3' },
  { id: 'clip-02', label: 'Studio Clip 02', audio: '/audio/clips/snippet-02.mp3' },
  { id: 'clip-03', label: 'Studio Clip 03', audio: '/audio/clips/snippet-03.mp3' },
  { id: 'clip-04', label: 'Studio Clip 04', audio: '/audio/clips/snippet-04.mp3' },
  { id: 'clip-05', label: 'Studio Clip 05', audio: '/audio/clips/snippet-05.mp3' },
  { id: 'clip-06', label: 'Studio Clip 06', audio: '/audio/clips/snippet-06.mp3' },
]

/* --------------------------------------------------------------------------
   Next drop / countdown
   -------------------------------------------------------------------------- */

/**
 * Set this to an object to switch the countdown section on.
 * Left null on purpose — no drop has been announced yet, so the section is
 * hidden rather than showing a made-up date.
 */
export const nextDrop: NextDrop | null = null

/* --------------------------------------------------------------------------
   Gallery / collection / press photos
   -------------------------------------------------------------------------- */

/**
 * Gallery slots for the /about lightbox.
 *
 * These reserve the layout for the photographs that will be dropped into
 * public/images/gallery/ later. They deliberately describe nothing: `alt` and
 * `caption` say a photograph belongs here rather than claiming to know what it
 * shows. Replace them with real copy the moment the files exist, and correct
 * `width` / `height` to the real pixel dimensions.
 */
export const gallery: ImageItem[] = Array.from({ length: 6 }, (_, index) => {
  const number = String(index + 1).padStart(2, '0')

  return {
    id: `photo-${number}`,
    src: `/images/gallery/photo-${number}.jpg`,
    alt: `Gallery photograph ${number} — awaiting the real image`,
    caption: `Photograph ${number}`,
    width: 350,
    height: 438,
    aspect: '4/5',
    isPlaceholder: true,
  }
})

/** Collecting corner — empty on purpose until real photos are supplied. */
export const collection: CollectionItem[] = []

export const collectionHeading = {
  title: 'The Collection',
  intro: `${PLACEHOLDER} — a sentence about the collection.`,
  emptyLabel: 'Photo coming soon',
}

export const pressPhotos: PressPhoto[] = []

export const pressQuotes: PressQuote[] = []

export const videos: VideoItem[] = []

/* --------------------------------------------------------------------------
   Shows
   -------------------------------------------------------------------------- */

export const shows: Show[] = []

export const showsEmptyMessage =
  'No shows yet. Join the crew and be the first to know.'

/* --------------------------------------------------------------------------
   Booking
   -------------------------------------------------------------------------- */

export const booking: BookingInfo = {
  name: `${PLACEHOLDER} — booking contact name`,
  email: 'booking@beatboy.example',
  instagram: 'https://instagram.com/djbutterfingers7',
  based: `${PLACEHOLDER} — city`,
  region: 'USA',
  availability: `${PLACEHOLDER} — dates or windows currently open.`,
  eventTypes: ['Shows', 'Features', 'Studio Sessions', 'DJ Sets', 'Collabs'],
  responseTime: `${PLACEHOLDER} — how quickly enquiries are usually answered.`,
  travel: `${PLACEHOLDER} — what is possible, what needs a quote.`,
  rates: 'Rates on request.',
  faq: [
    {
      question: 'How quickly do you reply?',
      answer: `${PLACEHOLDER} — give a realistic answer so bookers know what to expect.`,
    },
    {
      question: 'Do you travel?',
      answer: `${PLACEHOLDER} — describe what is possible and what needs a custom quote.`,
    },
    {
      question: 'What are your rates?',
      answer: 'Rates on request. Send the date, venue, capacity and budget and you will get a quote.',
    },
  ],
}

/* --------------------------------------------------------------------------
   Email sign-up
   -------------------------------------------------------------------------- */

export const newsletter = {
  heading: 'Join the Crew',
  copy: 'Get new music first. No spam, ever.',
  /** Shown under the field so people know what they are signing up for. */
  finePrint: 'One email when something new drops. Unsubscribe any time.',
  buttonLabel: 'Sign up',
  successMessage: "You're on the list. New music will show up here first.",
  errorMessage: 'Something went wrong. Please try again.',
}

/* --------------------------------------------------------------------------
   Press kit
   -------------------------------------------------------------------------- */

export const press = {
  heading: 'Press Kit',
  updated: '', // e.g. 'February 2026' — leave blank until there is a date to claim
  /** Relative path inside `public/press/`. */
  oneSheet: '/press/one-sheet.pdf',
  oneSheetLabel: 'Download One-Sheet (PDF)',
  photoUsage: 'Press use permitted with credit.',
  contactEmail: 'press@beatboy.example',
}

export const site: SiteSeo = {
  defaultTitle: `${ARTIST_NAME} | Old-School Rap Artist`,
  defaultDescription:
    'Official site of BeatBoy — old-school rap inspired by 70s and 80s hip-hop. Listen to the music, read the lyrics, book BeatBoy and download press materials.',
  titleTemplate: `${ARTIST_NAME} | %s`,
  ogImage: '/images/og-image.jpg',
  locale: 'en_US',
}

/* --------------------------------------------------------------------------
   Navigation
   -------------------------------------------------------------------------- */

export const navLinks = [
  { label: 'Home', to: '/' },
  { label: 'Music', to: '/music' },
  { label: 'Lyrics', to: '/lyrics' },
  { label: 'Press', to: '/press' },
  { label: 'Shows', to: '/shows' },
  { label: 'About', to: '/about' },
  { label: 'Book', to: '/book' },
] as const

export const footerLinks = [
  ...navLinks,
  { label: 'Links', to: '/links' },
] as const

export const credit = {
  designer: 'Escriptjose',
  designerUrl: '',
}

/* --------------------------------------------------------------------------
   Derived helpers — these read from the arrays above so numbers on the site
   are always true. They never invent anything.
   -------------------------------------------------------------------------- */

/** Facts for the press kit. Only real, verifiable values are listed. */
export function pressKeyFacts(): Array<{ label: string; value: string }> {
  const facts: Array<{ label: string; value: string }> = [
    { label: 'Stage name', value: artist.name },
    { label: 'Genre', value: artist.genre },
    { label: 'From', value: artist.origin },
    { label: 'Label', value: artist.label },
  ]
  if (releases.length > 0) {
    facts.push({ label: 'Releases', value: String(releases.length) })
  }
  return facts
}

export function formatDate(iso?: string): string {
  if (!iso) return ''
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return iso
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date)
}

export function formatShortDate(iso?: string): string {
  if (!iso) return ''
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return iso
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
  }).format(date)
}

/** `seconds` -> `m:ss` (or `h:mm:ss` past an hour). */
export function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00'
  const total = Math.floor(seconds)
  const hours = Math.floor(total / 3600)
  const minutes = Math.floor((total % 3600) / 60)
  const secs = total % 60
  const pad = (value: number) => String(value).padStart(2, '0')
  return hours > 0
    ? `${hours}:${pad(minutes)}:${pad(secs)}`
    : `${minutes}:${pad(secs)}`
}

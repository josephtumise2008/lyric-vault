/**
 * Shared content types.
 *
 * Every artist-specific value in the site is described by one of these shapes
 * and lives in `src/content.ts`. Components never hardcode artist data.
 */

export type AspectRatio = '1/1' | '4/5' | '3/4' | '3/2' | '4/3' | '16/9'

export type ImageItem = {
  id: string
  /** Path inside `public/`, e.g. `/images/gallery/photo-01-lakeside.jpg` */
  src: string
  /** Required. Describe what is actually visible in the photograph. */
  alt: string
  title?: string
  caption?: string
  credit?: string
  /** Reserves space before the file loads — prevents layout shift. */
  width: number
  height: number
  aspect?: AspectRatio
  /** Set while the real file has not been added yet. */
  isPlaceholder?: boolean
}

export type VideoItem = {
  id: string
  src: string
  /** Still frame shown before playback. */
  poster?: string
  title: string
  alt?: string
  caption?: string
  /** Photographer or source line. */
  credit?: string
  width?: number
  height?: number
  isPlaceholder?: boolean
}

export type StreamingPlatform =
  | 'Spotify'
  | 'Apple Music'
  | 'YouTube'
  | 'SoundCloud'
  | 'Bandcamp'
  | 'Amazon Music'

export type StreamingLink = {
  platform: StreamingPlatform
  url: string
  /** Overrides the platform name in link lists, e.g. "Listen on SoundCloud". */
  label?: string
}

export type ReleaseType = 'Single' | 'EP' | 'Album' | 'Mixtape' | 'Live'

export type Song = {
  id: string
  slug: string
  title: string
  /** Short hook shown on cards and in the player. */
  subtitle?: string
  releaseType: ReleaseType
  /** ISO date, e.g. "2026-01-30". Omit for unreleased work. */
  releaseDate?: string
  description?: string
  /** `/audio/clips/…` or `/audio/full-song.mp3` */
  audio?: string
  artwork?: string
  duration?: string
  lyricsSlug: string
  /** The story behind the track. Omit rather than inventing one. */
  story?: string
  tags?: string[]
  links?: StreamingLink[]
  credits?: string[]
  /** True while the copy is stand-in content. */
  isPlaceholder?: boolean
}

export type ReleaseTrack = {
  title: string
  /** Optional per-track audio so a release can be previewed in full. */
  audio?: string
}

export type Release = {
  id: string
  slug: string
  title: string
  type: ReleaseType
  releaseDate?: string
  description?: string
  artwork?: string
  tracklist?: ReleaseTrack[]
  links?: StreamingLink[]
  credits?: string[]
  isPlaceholder?: boolean
}

export type ShowStatus = 'Tickets' | 'Sold Out' | 'Free' | 'Past'

export type Show = {
  id: string
  /** ISO date. Leave blank for an event without a fixed date. */
  date?: string
  doors?: string
  /** Event name. Defaults to the venue when omitted. */
  title?: string
  venue?: string
  city: string
  region?: string
  status: ShowStatus
  ticketUrl?: string
  /** Shown next to the date, e.g. "$10 / $15 door". */
  price?: string
  notes?: string
}

export type SocialPlatform =
  | 'Instagram'
  | 'SoundCloud'
  | 'Spotify'
  | 'Apple Music'
  | 'YouTube'
  | 'TikTok'
  | 'Bandcamp'
  | 'X'
  | 'Facebook'

export type SocialLink = {
  id: string
  platform: SocialPlatform
  handle: string
  url: string
  /** Hidden on the compact link-in-bio page. */
  primary?: boolean
}

export type BookingEventType =
  | 'Shows'
  | 'Features'
  | 'Studio Sessions'
  | 'DJ Sets'
  | 'Collabs'

export type BookingInfo = {
  name: string
  email: string
  instagram?: string
  based: string
  region: string
  availability?: string
  eventTypes: BookingEventType[]
  faq: Array<{ question: string; answer: string }>
  responseTime: string
  travel: string
  rates: string
}

export type CollectionItem = {
  id: string
  src: string
  alt: string
  title?: string
  caption?: string
  width: number
  height: number
  /** Shown instead of the image when the file has not been added. */
  emptyLabel?: string
}

export type PressPhoto = ImageItem & {
  /** Filename offered for download; defaults to the basename of `src`. */
  downloadName?: string
}

export type PressQuote = {
  id: string
  quote: string
  source: string
  url?: string
  date?: string
}

export type NextDrop = {
  label: string
  /** ISO timestamp, e.g. "2026-06-13T20:00:00Z" */
  date: string
  title?: string
  url?: string
}

export type GalleryImage = ImageItem & {
  group?: 'gallery' | 'collection' | 'about'
}

export type SiteSeo = {
  defaultTitle: string
  defaultDescription: string
  titleTemplate: string
  /** Absolute or root-relative path to the social share image. */
  ogImage: string
  locale: string
}

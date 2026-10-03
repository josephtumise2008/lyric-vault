# How to update this site

You never need to touch a component. Every change happens in two steps:

1. **Put the file** in the matching folder inside `public/`.
2. **Add one entry** to the array in `src/content.ts` that already describes it.

Save. The site picks it up. `npm run dev` refreshes as you go.

If a file is missing, the page shows a tidy placeholder instead of a broken
image or a silent dead button — so you can add content in any order.

---

## 1. The artist name

Near the top of `src/content.ts`:

```ts
export const ARTIST_NAME = 'BeatBoy'
```

Change it once and the name updates everywhere — navigation, footer, page
titles, share text, press kit, structured headings. Nothing else hardcodes it.

---

## 2. Biography

```ts
export const artist = {
  bioShort: 'One sentence: who he is and what the music sounds like.',
  bioLong: [
    'Three or four sentences. Where he started, what shaped the sound.',
    'A second paragraph — the live show, the process, the influences.',
  ],
  ...
}
```

Delete the `PLACEHOLDER` marker when you write real copy. Until you do, pages
that use the bio show a small gold notice saying the copy is still standing in.

---

## 3. Photos

Add the file, then add an entry. Use the real pixel dimensions — they reserve
space and stop the page jumping while the image loads.

```ts
export const gallery: ImageItem[] = [
  {
    id: 'photo-07-studio',
    src: '/images/gallery/photo-07-studio.jpg',  // matches public/images/gallery/
    alt: 'BeatBoy at the mixing desk',           // describe what is visible
    caption: 'Studio, 2am',
    width: 350,                                  // the file's real size
    height: 438,
    aspect: '4/5',
  },
]
```

| Folder                    | Used by            |
| ------------------------- | ------------------ |
| `public/images/`          | Hero, about, OG    |
| `public/images/gallery/`  | `/about` gallery   |
| `public/images/collection/` | Collecting corner |
| `public/images/covers/`   | Release artwork    |
| `public/images/press/`    | `/press` downloads |

**Write good `alt` text.** Describe the photograph, never the filename. If a
photo is purely decorative, say so in the caption instead of leaving `alt` empty.

The supplied photos are around 350px wide, so keep them that size. They are
presented in bounded frames; uploading a 40KB thumbnail and letting the browser
scale it to full width is what makes a site look cheap.

### Hero and about portraits

```ts
heroImage: '/images/hero.jpg',
heroAlt: 'BeatBoy photographed for the site',
aboutImage: '/images/about.jpg',
aboutAlt: 'BeatBoy photographed for the about page',
```

### Social share image

`public/images/og-image.jpg`, 1200×630. Referenced by `site.ogImage`.

---

## 4. Music

### A song

```ts
export const songs: Song[] = [
  {
    id: 'song-04',
    slug: 'midnight-corridor',        // becomes /lyrics/midnight-corridor
    title: 'Midnight Corridor',
    subtitle: 'Short hook for cards',
    releaseType: 'Single',            // Single | EP | Album | Mixtape | Live
    releaseDate: '2026-03-14',        // omit for unreleased work
    audio: '/audio/full-song.mp3',
    artwork: '/images/covers/midnight-corridor.jpg',
    lyricsSlug: 'midnight-corridor',
    description: 'One or two sentences about the track.',
    story: 'The story behind it. Omit rather than inventing one.',
    tags: ['Old-School', 'Rap'],
    credits: ['Written and performed by BeatBoy'],
    links: [{ platform: 'SoundCloud', url: 'https://…' }],
  },
]
```

`slug` must be unique and lowercase with dashes. It becomes the URL — changing it
after launch breaks any shared links.

### Audio files

```
public/audio/full-song.mp3        a complete track
public/audio/clips/snippet-01.mp3  short excerpts
```

Use MP3 (plays everywhere, including iPhone Safari) at 128–192 kbps. Keep
clips under about 30 seconds.

### Lyrics

Lyrics live in their own array so the words are easy to hand over. Each line is
one string. Section headers use square brackets:

```ts
export const lyrics: Lyric[] = [
  {
    songSlug: 'midnight-corridor',   // must match a song's slug
    title: 'Midnight Corridor',
    release: 'Single',
    year: '2026',
    lines: [
      '[Verse 1]',
      'First line of the verse',
      'Second line of the verse',
      '',
      '[Chorus]',
      'The hook, written exactly as it is sung',
    ],
    story: 'What this song is about.',
    tags: ['Old-School', 'Rap'],
    isComplete: true,               // false keeps the "not supplied" notice
  },
]
```

Until `isComplete` is `true`, the page says the lyrics are still to come rather
than showing an empty page. Blank lines become verse gaps.

The filter tags on `/lyrics` are derived from the lyrics automatically — add a
tag anywhere and it appears in the filter row.

### Releases

```ts
export const releases: Release[] = [
  {
    id: 'release-02',
    slug: 'midnight-corridor',
    title: 'Midnight Corridor',
    type: 'Single',
    releaseDate: '2026-03-14',
    description: 'What it is.',
    artwork: '/images/covers/midnight-corridor.jpg',
    tracklist: [{ title: 'Midnight Corridor', audio: '/audio/full-song.mp3' }],
    links: [{ platform: 'Spotify', url: 'https://…' }],
  },
]
```

`releases[0]` is what the homepage shows under "Latest release" — put the newest
release first.

### Studio clips

```ts
export const studioClips = [
  { id: 'clip-01', label: 'Studio Clip 01', audio: '/audio/clips/snippet-01.mp3' },
]
```

Labels are shown verbatim, so they stay neutral until the clips are named.

### Announcing a drop (countdown)

```ts
export const nextDrop: NextDrop | null = {
  label: 'Next drop',
  date: '2026-06-13T20:00:00Z',
  title: 'Single 02',
}
```

`null` hides the countdown completely. Nothing is shown until there is a real
date to count down to.

---

## 5. Shows

```ts
export const shows: Show[] = [
  {
    id: 'show-01',
    date: '2026-04-18',
    doors: '19:00',
    title: 'Support for …',        // omit to use the venue name
    venue: 'The Basement',
    city: 'New York',
    region: 'NY',
    status: 'Tickets',            // Tickets | Sold Out | Free | Past
    ticketUrl: 'https://…',        // omit for free entry
    price: '$10 / $15 door',
    notes: 'Age 21+. Limited capacity.',
  },
]
```

Dates in the past move themselves into the archive. With `shows: []` the page
shows an honest empty state with the mailing list instead of a bare section.

---

## 6. Socials

```ts
export const socials: SocialLink[] = [
  { id: 'social-instagram', platform: 'Instagram', handle: '@djbutterfingers7',
    url: 'https://instagram.com/djbutterfingers7', primary: true },
]
```

Supported `platform` values: `Instagram`, `SoundCloud`, `Spotify`,
`Apple Music`, `YouTube`, `TikTok`, `Bandcamp`, `X`, `Facebook`. Anything else
falls back to a neutral mark.

Adding a platform here updates the footer, `/book` and the `/links` page at
once. Check any SoundCloud short link before publishing — it has not been
verified.

---

## 7. Booking

```ts
export const booking: BookingInfo = {
  name: 'Real contact name',
  email: 'booking@realdomain.com',
  instagram: 'https://instagram.com/…',
  based: 'City',
  region: 'State',
  availability: 'Dates currently open.',
  eventTypes: ['Shows', 'Features', 'Studio Sessions', 'DJ Sets', 'Collabs'],
  responseTime: 'Usually within two days.',
  travel: 'What is possible, what needs a quote.',
  rates: 'Rates on request.',
  faq: [{ question: '…', answer: '…' }],
}
```

`eventTypes` drives the dropdown in the form, so it and the copy stay in step.

---

## 8. Press kit

```ts
export const press = {
  updated: 'March 2026',
  oneSheet: '/press/one-sheet.pdf',
  oneSheetLabel: 'Download One-Sheet (PDF)',
  photoUsage: 'Press use permitted with credit.',
  contactEmail: 'press@realdomain.com',
}
```

Add the PDF to `public/press/`. The download links use the filename directly, so
the extension matters.

### Press photographs

```ts
export const pressPhotos: PressPhoto[] = [
  {
    id: 'press-01',
    src: '/images/press/portrait-01.jpg',
    alt: 'BeatBoy, portrait, against a plain wall',
    caption: 'Portrait 01',
    credit: 'Photographer name',
    width: 2000,
    height: 2500,
    downloadName: 'beatboy-portrait-01.jpg',   // optional
  },
]
```

Each entry gets an "Original" download button pointing at the file in
`public/`. Upload press photographs at full resolution — these are the files
publications will print.

### Press quotes

```ts
export const pressQuotes: PressQuote[] = [
  { id: 'quote-01', quote: 'What they said.', source: 'Publication', url: 'https://…', date: '2026-02' },
]
```

The quotes section disappears entirely while this array is empty. Never invent a
quote to fill the space.

---

## 9. The collecting corner

```ts
export const collection: CollectionItem[] = [
  { id: 'collect-01', src: '/images/collection/figure-01.jpg',
    alt: 'Painted action figure on a shelf', width: 350, height: 350 },
]
```

Empty by default, and the About page says "Photo coming soon" rather than
implying there is a collection to look at.

---

## 10. Newsletter and form endpoint

Copy lives here:

```ts
export const newsletter = {
  heading: 'Join the Crew',
  copy: 'Get new music first. No spam, ever.',
  finePrint: 'One email when something new drops. Unsubscribe any time.',
  buttonLabel: 'Sign up',
  successMessage: "You're on the list.",
  errorMessage: 'Something went wrong. Please try again.',
}
```

Delivery is configured with an environment variable, not in code:

```bash
cp .env.example .env
```

```
VITE_FORM_ENDPOINT=https://formspree.io/f/yourFormId
```

Any endpoint that accepts a JSON `POST` works — Formspree, Basin, a Netlify
function, your own API. Leave it blank and the site validates the fields and
shows the success state without sending anything, so the flow can be reviewed
before a provider is picked. The booking form also has a hidden honeypot field
that silently drops bot submissions.

---

## 11. Navigation

```ts
export const navLinks = [
  { label: 'Home', to: '/' },
  { label: 'Music', to: '/music' },
  // …
] as const

export const footerLinks = [...navLinks, { label: 'Links', to: '/links' }] as const
```

Add or remove a page here after creating it in `src/pages/`. The drawer on
mobile and the desktop bar both read from this array.

---

## Things worth knowing

- **Nothing autoplays.** Audio only starts from a real tap or key press — that
  is a browser requirement, especially on iPhone.
- **Only one track plays at a time.** That is the shared audio engine working,
  not a setting to change.
- **Colours and fonts** live in `src/index.css` as Tailwind tokens. Change them
  there and the whole site follows.
- **Reduced motion** is respected automatically. Users who ask for it get a
  still site with no spinning vinyl or sliding marquee.
- **Before publishing**: replace every `PLACEHOLDER` in `src/content.ts`, verify
  the social links, and check the `.env` endpoint is set if forms should deliver.

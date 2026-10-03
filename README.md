# BeatBoy — official site

Old-school rap artist website. React + TypeScript + Vite + Tailwind, no
backend, no database, no app-store chrome. Everything the visitor sees comes
from two places: files inside `public/`, and one content file,
[`src/content.ts`](src/content.ts).

```
npm install
npm run dev      # http://localhost:5173
npm run build    # type-check + production build into dist/
npm run preview  # serve the production build locally
npm run lint
```

---

## The one rule

**Never edit a component to add or change artist content.** Every name, bio,
photo, track, lyric, show, link and email address lives in `src/content.ts`.
Add an entry there and the correct page updates itself.

Full walkthrough with copy-and-paste examples:
[`HOW TO UPDATE.md`](HOW TO UPDATE.md).

---

## Layout

```
public/
  images/          hero.jpg, about.jpg, og-image.jpg
    gallery/       photographs for /about
    collection/    collecting corner (empty by default)
    covers/        release artwork
    press/         press photographs
  audio/
    full-song.mp3
    clips/         snippet-01.mp3 … snippet-06.mp3
  videos/
  press/           one-sheet.pdf
  favicon.svg

src/
  content.ts       ← every artist-specific value
  types/           the shapes content.ts is typed against
  lib/             audio engine, forms, SEO, media helpers, motion
  components/      reusable UI (player, forms, gallery, art)
  layouts/         navbar, footer, page shell
  pages/           one file per route
```

## Routes

| Path            | Page                                                |
| --------------- | --------------------------------------------------- |
| `/`             | Hero, latest release, track list, lyrics, newsletter |
| `/music`        | Featured player, discography, tracks, studio clips   |
| `/lyrics`       | Searchable index of every song                       |
| `/lyrics/:slug` | One song: lyrics, player, credits, prev/next         |
| `/press`        | Bio, key facts, press photos, one-sheet download     |
| `/shows`        | Tour dates with an honest empty state                |
| `/about`        | Story, gallery with lightbox, collecting corner      |
| `/book`         | Booking form, availability, FAQ                      |
| `/links`        | Link-in-bio page                                     |
| anything else   | 404                                                  |

## Audio

`src/lib/audioEngine.ts` owns a single `<audio>` element for the whole site.
That is what enforces "only one track plays at a time" — every player reads the
same engine, so starting a track anywhere stops it everywhere else.

- Nothing autoplays. The element is created inside a user gesture, which is what
  iOS Safari requires.
- `AudioVisualizer` draws a real spectrum through a Web Audio `AnalyserNode`.
  Where Web Audio is unavailable the audio still plays and the visualiser falls
  back to a static bar chart.
- Media Session metadata is set so lock-screen and headset controls show the
  right track.
- A missing file shows "This audio file has not been uploaded yet" instead of a
  dead button.

## Forms

Booking and newsletter both post through `src/lib/forms.ts`, which reads
`VITE_FORM_ENDPOINT` from the environment. With no endpoint configured the site
validates the fields, shows the success state and logs the payload in
development — so the flow can be reviewed before a provider is chosen.

```bash
cp .env.example .env
# then set VITE_FORM_ENDPOINT to a real endpoint
```

## Placeholders, on purpose

Lyrics, biography, press quotes, show dates, collection photos and follower
numbers are **not** invented. They ship as clearly marked placeholders, the
affected sections hide themselves when they have no real content, and pages say
plainly when something has not been supplied yet. See `PLACEHOLDER` in
`src/content.ts`.

## Design system

Colours, type and texture are declared as Tailwind v4 tokens in
[`src/index.css`](src/index.css).

| Token             | Value     | Use                          |
| ----------------- | --------- | ---------------------------- |
| `--color-ink`     | `#0A0A0B` | Background                   |
| `--color-surface` | `#141416` | Cards and panels             |
| `--color-line`    | `#2A2A2F` | Borders                      |
| `--color-bone`    | `#EDE9DF` | Text                         |
| `--color-blood`   | `#D3122A` | Primary accent               |
| `--color-gold`    | `#F5B301` | Secondary accent             |
| `--color-acid`    | `#39FF14` | Audio only                   |

Fonts: **Anton** (display), **Permanent Marker** (handwriting), **Special Elite**
(typewriter body), **Inter** (UI). Loaded from Google Fonts in `index.html`.

## Accessibility and performance notes

- Skip link, landmark elements, visible focus rings, labelled controls, live
  regions for form results, and a focus-trapped drawer and lightbox.
- `prefers-reduced-motion` is honoured globally; the vinyl stops spinning, the
  marquee stills, reveals resolve immediately.
- Photographs are ~350px wide and are shown in bounded frames with their real
  aspect ratio — never stretched across a viewport.
- Images are lazy-loaded with reserved space, the hero is eager, and pages other
  than the homepage are code-split.

## Deployment

`npm run build` produces a static `dist/`. Any static host works. Because the
router uses real paths, configure a rewrite of unknown paths to `/index.html`
(Netlify `_redirects`, Vercel rewrites, `404.html` on GitHub Pages, an Apache
`FallbackResource`, or an nginx `try_files`).

import { Download, FileText, Mail, Quote } from 'lucide-react'

import {
  ARTIST_NAME,
  PLACEHOLDER,
  artist,
  press,
  pressPhotos,
  pressQuotes,
  pressKeyFacts,
} from '../content'
import { getFilename } from '../lib/media'

import { CropMarks, FlourishArt } from '../components/art/Doodles'
import { Button } from '../components/Button'
import { PageHeader } from '../components/PageHeader'
import { Section } from '../components/Section'
import { Seo } from '../components/Seo'
import { SmartImage } from '../components/SmartImage'

function Bios() {
  const placeholders = [artist.bioShort, ...artist.bioLong].filter((line) =>
    line.includes(PLACEHOLDER),
  )

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_1.35fr] lg:gap-14">
      <div>
        <h2 className="kicker mb-3">Short bio</h2>
        <p className="type-accent text-lg leading-relaxed text-bone">{artist.bioShort}</p>
      </div>

      <div>
        <h2 className="kicker mb-3">Long bio</h2>
        <div className="space-y-4">
          {artist.bioLong.map((paragraph) => (
            <p key={paragraph} className="text-[0.9375rem] leading-relaxed text-muted">
              {paragraph}
            </p>
          ))}
        </div>

        {placeholders.length > 0 && (
          <p className="mt-6 border border-gold/30 bg-gold/[0.05] px-4 py-3 text-[0.8125rem] leading-relaxed text-bone-dim">
            <span className="font-semibold uppercase tracking-[0.14em] text-gold">
              Placeholder copy.
            </span>{' '}
            These paragraphs are stand-ins. Replace them in{' '}
            <code className="type-accent text-bone">src/content.ts</code> — the press kit never
            publishes invented biography.
          </p>
        )}
      </div>
    </div>
  )
}

function KeyFacts() {
  const facts = pressKeyFacts()

  return (
    <dl className="grid grid-cols-2 gap-px border border-line bg-line sm:grid-cols-3 lg:grid-cols-5">
      {facts.map((fact) => (
        <div key={fact.label} className="bg-surface px-4 py-5">
          <dt className="kicker text-[0.5625rem]">{fact.label}</dt>
          <dd className="mt-1.5 text-sm text-bone">{fact.value}</dd>
        </div>
      ))}
    </dl>
  )
}

function PhotoDownloads() {
  if (pressPhotos.length === 0) {
    return (
      <div className="border border-dashed border-line px-6 py-14 text-center">
        <p className="type-accent text-sm text-muted">
          No press photographs supplied yet. Original files appear here as soon as they are added.
        </p>
      </div>
    )
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {pressPhotos.map((photo) => (
        <figure key={photo.id} className="border border-line bg-surface">
          <div className="border-b border-line p-3">
            <div className="relative mx-auto w-full max-w-[16rem]">
              <SmartImage
                src={photo.src}
                alt={photo.alt}
                width={photo.width}
                height={photo.height}
                className="aspect-[4/5] w-full"
              />
            </div>
          </div>
          <figcaption className="flex items-center justify-between gap-3 p-4">
            <div className="min-w-0">
              <p className="truncate text-[0.8125rem] text-bone">
                {photo.caption ?? photo.alt}
              </p>
              {photo.credit && (
                <p className="type-accent text-[0.625rem] text-muted-dim">{photo.credit}</p>
              )}
            </div>
            <a
              href={photo.src}
              download={photo.downloadName ?? getFilename(photo.src)}
              className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-[2px] border border-line px-3 text-[0.625rem] font-semibold uppercase tracking-[0.12em] text-muted transition-colors hover:border-blood hover:text-bone"
              aria-label={`Download original: ${photo.caption ?? photo.alt}`}
            >
              <Download aria-hidden="true" className="size-3.5" />
              Original
            </a>
          </figcaption>
        </figure>
      ))}
    </div>
  )
}

function Quotes() {
  // The section is removed entirely until real quotes exist.
  if (pressQuotes.length === 0) return null

  return (
    <Section
      index="—"
      eyebrow="Press"
      title="What they said"
      className="border-t border-line"
      ambient
    >
      <ul className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {pressQuotes.map((item) => (
          <li key={item.id} className="relative border border-line bg-surface p-6">
            <Quote aria-hidden="true" className="size-5 text-blood" />
            <blockquote className="type-accent mt-4 text-[0.9375rem] leading-relaxed text-bone-dim">
              {item.quote}
            </blockquote>
            <footer className="mt-5 border-t border-line pt-3">
              <cite className="kicker not-italic">{item.source}</cite>
              {item.date && (
                <span className="type-accent ml-2 text-[0.625rem] text-muted-dim">{item.date}</span>
              )}
            </footer>
          </li>
        ))}
      </ul>
    </Section>
  )
}

export default function Press() {
  return (
    <>
      <Seo
        title="Press Kit"
        description={`Electronic press kit for ${ARTIST_NAME} — bio, key facts, press photographs, downloads and booking contact.`}
        path="/press"
      />

      <PageHeader
        index="03"
        eyebrow="Press kit"
        title="Everything you need"
        lede="Bio, facts, photographs and downloads. Built to be copied into a publication without a follow-up email."
      >
        <div className="flex flex-wrap items-center gap-3">
          <Button href={press.oneSheet} variant="primary">
            <FileText aria-hidden="true" className="size-4" />
            {press.oneSheetLabel}
          </Button>
          {press.updated && (
            <span className="type-accent text-xs text-muted-dim">Updated {press.updated}</span>
          )}
        </div>
      </PageHeader>

      <Section index="01" eyebrow="Biography">
        <Bios />
        <div className="mt-12">
          <KeyFacts />
        </div>
      </Section>

      <Section
        index="02"
        eyebrow="Photography"
        title="Press photographs"
        description={`${press.photoUsage} Original files are downloadable straight from this page.`}
        className="border-t border-line"
      >
        <div className="mb-6 flex items-center gap-3">
          <CropMarks className="size-6 text-blood" />
          <p className="kicker">High resolution</p>
          <FlourishArt className="ml-auto h-8 w-16 text-line" />
        </div>
        <PhotoDownloads />
      </Section>

      <Quotes />

      <Section index="—" eyebrow="Contact" spacing="md" className="border-t border-line">
        <div className="relative overflow-hidden border border-line bg-surface p-6 sm:p-10">
          <div aria-hidden="true" className="halftone absolute inset-0 opacity-30" />
          <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl text-bone sm:text-3xl">Need something else?</h2>
              <p className="mt-2 max-w-lg text-[0.9375rem] leading-relaxed text-muted">
                Interviews, artwork, higher-resolution files or a feature — email{' '}
                <a
                  href={`mailto:${press.contactEmail}`}
                  className="link-underline text-bone"
                >
                  {press.contactEmail}
                </a>
                .
              </p>
            </div>
            <Button href={`mailto:${press.contactEmail}`} variant="outline" className="shrink-0">
              <Mail aria-hidden="true" className="size-4" />
              Email press
            </Button>
          </div>
        </div>
      </Section>
    </>
  )
}

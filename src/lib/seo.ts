import { site } from '../content'

/**
 * Document head management.
 *
 * There is no head library here on purpose: one component owns the few tags
 * that actually change per page, which keeps the bundle small and the markup
 * easy to audit.
 */

const MANAGED = 'data-seo-managed'

function upsertMeta(selector: string, attrs: Record<string, string>): void {
  let element = document.head.querySelector<HTMLMetaElement>(selector)
  if (!element) {
    element = document.createElement('meta')
    element.setAttribute(MANAGED, '')
    document.head.appendChild(element)
  }
  for (const [key, value] of Object.entries(attrs)) {
    element.setAttribute(key, value)
  }
}

function upsertLink(rel: string, href: string): void {
  let element = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`)
  if (!element) {
    element = document.createElement('link')
    element.setAttribute('rel', rel)
    element.setAttribute(MANAGED, '')
    document.head.appendChild(element)
  }
  element.setAttribute('href', href)
}

function absoluteUrl(path: string): string {
  if (/^https?:\/\//i.test(path)) return path
  const origin = typeof window === 'undefined' ? '' : window.location.origin
  return `${origin}${path.startsWith('/') ? path : `/${path}`}`
}

export type SeoInput = {
  /** Page name, e.g. "Music". Omit on the homepage. */
  title?: string
  description?: string
  /** Root-relative path such as `/images/og-image.jpg`. */
  image?: string
  /** Route path, used for the canonical URL and Open Graph. */
  path?: string
  /** `article` reads better for individual lyric pages. */
  type?: 'website' | 'article'
  /** Keeps error pages out of search results. */
  noIndex?: boolean
}

/** Apply title, description, canonical and social metadata for a page. */
export function applySeo({
  title,
  description,
  image,
  path,
  type = 'website',
  noIndex = false,
}: SeoInput): void {
  const fullTitle = title
    ? site.titleTemplate.replace('%s', title)
    : site.defaultTitle
  const metaDescription = description ?? site.defaultDescription
  const metaImage = absoluteUrl(image ?? site.ogImage)
  const canonical = absoluteUrl(path ?? (typeof window === 'undefined' ? '/' : window.location.pathname))

  document.title = fullTitle

  upsertMeta('meta[name="description"]', { name: 'description', content: metaDescription })
  upsertMeta('meta[name="robots"]', {
    name: 'robots',
    content: noIndex ? 'noindex, follow' : 'index, follow',
  })

  upsertMeta('meta[property="og:title"]', { property: 'og:title', content: fullTitle })
  upsertMeta('meta[property="og:description"]', { property: 'og:description', content: metaDescription })
  upsertMeta('meta[property="og:type"]', { property: 'og:type', content: type })
  upsertMeta('meta[property="og:url"]', { property: 'og:url', content: canonical })
  upsertMeta('meta[property="og:image"]', { property: 'og:image', content: metaImage })
  upsertMeta('meta[property="og:image:alt"]', { property: 'og:image:alt', content: fullTitle })
  upsertMeta('meta[property="og:locale"]', { property: 'og:locale', content: site.locale })
  upsertMeta('meta[property="og:site_name"]', {
    property: 'og:site_name',
    content: site.defaultTitle.split('|')[0]?.trim() ?? '',
  })

  upsertMeta('meta[name="twitter:card"]', {
    name: 'twitter:card',
    content: 'summary_large_image',
  })
  upsertMeta('meta[name="twitter:title"]', { name: 'twitter:title', content: fullTitle })
  upsertMeta('meta[name="twitter:description"]', {
    name: 'twitter:description',
    content: metaDescription,
  })
  upsertMeta('meta[name="twitter:image"]', { name: 'twitter:image', content: metaImage })

  upsertLink('canonical', canonical)
}

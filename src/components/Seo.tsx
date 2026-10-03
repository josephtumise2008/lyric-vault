import { useEffect } from 'react'

import { applySeo } from '../lib/seo'
import type { SeoInput } from '../lib/seo'

/**
 * Sets the document title and social metadata for the current page.
 *
 * Dropped inside each page component so the tags are declared next to the
 * content they describe. Rendered output is nothing — it is a head-only effect.
 */
export function Seo(props: SeoInput) {
  const { title, description, image, path, type, noIndex } = props

  useEffect(() => {
    applySeo({ title, description, image, path, type, noIndex })
  }, [title, description, image, path, type, noIndex])

  return null
}

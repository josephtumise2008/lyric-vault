/** Minimal class-name joiner: drops falsy values, de-dupes, keeps order. */
export function cn(...parts: Array<string | false | null | undefined>): string {
  const seen = new Set<string>()
  for (const part of parts) {
    if (!part) continue
    for (const token of part.split(/\s+/)) {
      if (token) seen.add(token)
    }
  }
  return [...seen].join(' ')
}

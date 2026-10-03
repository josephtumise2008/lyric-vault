import { Check, Copy, Share2 } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'

import { cn } from '../lib/cn'

type ActionButtonProps = {
  children: React.ReactNode
  onClick: () => void
  className?: string
  confirmed?: boolean
  icon: React.ReactNode
}

function ActionButton({ children, onClick, className, confirmed = false, icon }: ActionButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'inline-flex h-10 items-center gap-2 rounded-[2px] border border-line px-4 text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-muted transition-all duration-300 hover:border-blood hover:bg-blood/10 hover:text-bone',
        confirmed && 'border-acid/50 text-acid',
        className,
      )}
    >
      {icon}
      {children}
    </button>
  )
}

/**
 * Writes to the clipboard, falling back to a hidden textarea because the async
 * Clipboard API is unavailable on insecure origins (some preview setups included).
 */
async function writeClipboard(target: string): Promise<boolean> {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(target)
      return true
    }
  } catch {
    // Fall through to the legacy path below.
  }

  try {
    const field = document.createElement('textarea')
    field.value = target
    field.setAttribute('readonly', '')
    field.style.position = 'absolute'
    field.style.left = '-9999px'
    document.body.appendChild(field)
    field.select()
    const ok = document.execCommand('copy')
    document.body.removeChild(field)
    return ok
  } catch {
    return false
  }
}

/** Confirms the action inline for a couple of seconds, then resets. */
function useConfirmation() {
  const [confirmed, setConfirmed] = useState(false)

  const confirm = useCallback(() => {
    setConfirmed(true)
    window.setTimeout(() => setConfirmed(false), 2200)
  }, [])

  return { confirmed, confirm }
}

export function CopyLinkButton({
  url,
  label = 'Copy link',
  className,
}: {
  url?: string
  label?: string
  className?: string
}) {
  const { confirmed, confirm } = useConfirmation()

  const handleClick = useCallback(async () => {
    const target = url ?? (typeof window === 'undefined' ? '' : window.location.href)
    if (await writeClipboard(target)) confirm()
  }, [url, confirm])

  return (
    <ActionButton
      onClick={handleClick}
      className={className}
      confirmed={confirmed}
      icon={
        confirmed ? (
          <Check aria-hidden="true" className="size-3.5" />
        ) : (
          <Copy aria-hidden="true" className="size-3.5" />
        )
      }
    >
      {confirmed ? 'Copied' : label}
    </ActionButton>
  )
}

/**
 * Native share sheet where the platform offers one, with a clipboard copy as
 * the fallback everywhere else.
 */
export function ShareButton({
  title,
  text,
  url,
  className,
}: {
  title: string
  text?: string
  url?: string
  className?: string
}) {
  const { confirmed, confirm } = useConfirmation()

  const canShare = typeof navigator !== 'undefined' && 'share' in navigator
  const target = url ?? (typeof window === 'undefined' ? '' : window.location.href)

  const handleClick = useCallback(async () => {
    if (canShare) {
      try {
        await navigator.share({ title, text, url: target })
        return
      } catch {
        // Dismissed, or the payload was rejected — fall back to copying.
      }
    }
    if (await writeClipboard(target)) confirm()
  }, [canShare, title, text, target, confirm])

  return (
    <ActionButton
      onClick={handleClick}
      className={className}
      confirmed={confirmed}
      icon={
        confirmed ? (
          <Check aria-hidden="true" className="size-3.5" />
        ) : (
          <Share2 aria-hidden="true" className="size-3.5" />
        )
      }
    >
      {confirmed ? 'Link copied' : canShare ? 'Share' : 'Copy link'}
    </ActionButton>
  )
}

/** Back-to-top control that appears once the page has scrolled. */
export function ScrollTopButton({ className }: { className?: string }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 700)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="Back to top"
      className={cn(
        'flex size-10 items-center justify-center rounded-[2px] border border-line bg-surface text-muted transition-all duration-300 hover:border-blood hover:text-blood',
        visible ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-2 opacity-0',
        className,
      )}
    >
      <svg viewBox="0 0 24 24" aria-hidden="true" className="size-4" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 19V5M5 12l7-7 7 7" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  )
}

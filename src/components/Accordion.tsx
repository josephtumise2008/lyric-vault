import { AnimatePresence, motion } from 'framer-motion'
import { Minus, Plus } from 'lucide-react'
import { useId, useState } from 'react'

import { cn } from '../lib/cn'
import { EASE, useMotionPrefs } from '../lib/motion'

export type AccordionItem = {
  question: string
  answer: string
}

type AccordionProps = {
  items: AccordionItem[]
  className?: string
  /** Index of the item open on first render. */
  defaultOpen?: number | null
}

type RowProps = {
  item: AccordionItem
  isOpen: boolean
  onToggle: () => void
  panelId: string
  buttonId: string
}

/** One disclosure row — a real button controlling a labelled region. */
function Row({ item, isOpen, onToggle, panelId, buttonId }: RowProps) {
  const { still } = useMotionPrefs()

  return (
    <div className="border-b border-line">
      <h3>
        <button
          type="button"
          id={buttonId}
          aria-expanded={isOpen}
          aria-controls={panelId}
          onClick={onToggle}
          className="flex w-full items-center justify-between gap-4 py-5 text-left transition-colors duration-300 hover:text-blood"
        >
          <span className="text-[0.9375rem] font-medium text-bone sm:text-base">
            {item.question}
          </span>
          <span
            aria-hidden="true"
            className={cn(
              'flex size-7 shrink-0 items-center justify-center rounded-[2px] border transition-all duration-300',
              isOpen ? 'rotate-180 border-blood bg-blood/15 text-blood' : 'border-line text-muted',
            )}
          >
            {isOpen ? <Minus className="size-3.5" /> : <Plus className="size-3.5" />}
          </span>
        </button>
      </h3>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            id={panelId}
            role="region"
            aria-labelledby={buttonId}
            initial={still ? false : { height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={still ? { opacity: 0 } : { height: 0, opacity: 0 }}
            transition={{ duration: still ? 0 : 0.38, ease: EASE }}
            className="overflow-hidden"
          >
            <p className="max-w-2xl pb-6 pr-10 text-[0.9375rem] leading-relaxed text-muted">
              {item.answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/**
 * Accessible accordion. One panel open at a time keeps the FAQ short on mobile.
 */
export function Accordion({ items, className, defaultOpen = null }: AccordionProps) {
  const baseId = useId()
  const [openIndex, setOpenIndex] = useState<number | null>(defaultOpen)

  if (items.length === 0) return null

  return (
    <div className={cn('border-t border-line', className)}>
      {items.map((item, index) => {
        const isOpen = openIndex === index
        return (
          <Row
            key={item.question}
            item={item}
            isOpen={isOpen}
            onToggle={() => setOpenIndex(isOpen ? null : index)}
            panelId={`${baseId}-panel-${index}`}
            buttonId={`${baseId}-button-${index}`}
          />
        )
      })}
    </div>
  )
}

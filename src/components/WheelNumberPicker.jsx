import { useEffect, useMemo, useRef } from 'react'

const ITEM_HEIGHT = 36
const VISIBLE_ROWS = 3
const SIDE_PADDING = ((VISIBLE_ROWS - 1) / 2) * ITEM_HEIGHT

export function WheelNumberPicker({ label, value, min, max, onChange }) {
  const listRef = useRef(null)
  const programmaticScrollRef = useRef(false)
  const values = useMemo(() => Array.from({ length: max - min + 1 }, (_, i) => min + i), [min, max])

  useEffect(() => {
    const container = listRef.current
    if (!container) return

    const targetIndex = values.indexOf(value)
    if (targetIndex < 0) return

    const targetScroll = targetIndex * ITEM_HEIGHT
    if (Math.abs(container.scrollTop - targetScroll) <= 1) return

    programmaticScrollRef.current = true
    container.scrollTo({ top: targetScroll, behavior: 'auto' })

    requestAnimationFrame(() => {
      programmaticScrollRef.current = false
    })
  }, [value, values])

  const updateValueFromScroll = () => {
    if (programmaticScrollRef.current) return

    const container = listRef.current
    if (!container) return

    const rawIndex = Math.round(container.scrollTop / ITEM_HEIGHT)
    const boundedIndex = Math.max(0, Math.min(values.length - 1, rawIndex))
    const nextValue = values[boundedIndex]

    if (nextValue !== value) {
      onChange(nextValue)
    }
  }

  const onKeyDown = (event) => {
    if (event.key === 'ArrowUp') {
      event.preventDefault()
      onChange(Math.min(max, value + 1))
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault()
      onChange(Math.max(min, value - 1))
    }
  }

  return (
    <div className="flex flex-col gap-1.5">
      <span className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-app-muted">{label}</span>

      <div className="quick-config-wheel-wrapper relative">
        <div className="quick-config-wheel-highlight pointer-events-none absolute inset-x-2 top-1/2 z-10 -translate-y-1/2 rounded-xl" />

        <ul
          ref={listRef}
          tabIndex={0}
          aria-label={label}
          onScroll={updateValueFromScroll}
          onKeyDown={onKeyDown}
          className="quick-config-wheel no-scrollbar relative z-0 h-[116px] snap-y snap-mandatory overflow-y-scroll rounded-2xl px-1 text-center outline-none sm:h-[132px]"
          style={{ paddingTop: SIDE_PADDING, paddingBottom: SIDE_PADDING }}
        >
          {values.map((optionValue) => (
            <li
              key={optionValue}
              className={`flex h-9 snap-center items-center justify-center font-extrabold leading-none transition-all [font-variant-numeric:tabular-nums] ${
                optionValue === value
                  ? 'text-app-text text-3xl opacity-100'
                  : 'text-app-subtle text-xl opacity-40'
              }`}
            >
              {optionValue}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

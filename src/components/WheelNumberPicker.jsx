import { useEffect, useMemo, useRef } from 'react'

const ITEM_HEIGHT = 40
const VISIBLE_ROWS = 5
const SIDE_PADDING = ((VISIBLE_ROWS - 1) / 2) * ITEM_HEIGHT

export function WheelNumberPicker({ label, value, min, max, onChange }) {
  const listRef = useRef(null)
  const values = useMemo(() => Array.from({ length: max - min + 1 }, (_, i) => min + i), [min, max])

  useEffect(() => {
    const container = listRef.current
    if (!container) return

    const targetScroll = (value - min) * ITEM_HEIGHT
    if (Math.abs(container.scrollTop - targetScroll) > 1) {
      container.scrollTo({ top: targetScroll, behavior: 'smooth' })
    }
  }, [value, min])

  const updateValueFromScroll = () => {
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
    <div className="flex flex-col gap-2">
      <span className="block text-[10px] font-semibold uppercase tracking-[0.2em] text-app-muted">{label}</span>

      <div className="quick-config-wheel-wrapper relative">
        <div className="quick-config-wheel-highlight pointer-events-none absolute inset-x-2 top-1/2 z-10 -translate-y-1/2 rounded-xl" />

        <ul
          ref={listRef}
          tabIndex={0}
          aria-label={label}
          onScroll={updateValueFromScroll}
          onKeyDown={onKeyDown}
          className="quick-config-wheel no-scrollbar relative z-0 h-[200px] snap-y snap-mandatory overflow-y-auto rounded-2xl px-2 text-center outline-none"
          style={{ paddingTop: SIDE_PADDING, paddingBottom: SIDE_PADDING }}
        >
          {values.map((optionValue) => (
            <li
              key={optionValue}
              className={`flex h-10 snap-center items-center justify-center text-2xl font-extrabold leading-none transition-opacity [font-variant-numeric:tabular-nums] ${
                optionValue === value ? 'text-app-text opacity-100' : 'text-app-subtle opacity-45'
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

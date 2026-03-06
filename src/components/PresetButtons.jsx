import { m } from 'framer-motion'
import { PRESETS } from '../lib/timerLogic'

const MotionButton = m.button

export function PresetButtons({ selected, onSelect, title }) {
  return (
    <section className="space-y-2">
      <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-white/45">{title}</p>
      <div className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
        {Object.entries(PRESETS).map(([key, preset]) => {
          const active = selected === key
          return (
            <MotionButton
              key={key}
              type="button"
              onClick={() => onSelect(key)}
              whileTap={{ scale: 0.96 }}
              animate={{ scale: active ? 1.02 : 1 }}
              transition={{ type: 'spring', stiffness: 340, damping: 24 }}
              className={`whitespace-nowrap rounded-full border px-4 py-2.5 text-sm font-semibold transition ${
                active
                  ? 'border-white/40 bg-white/20 text-white shadow-[0_10px_30px_rgba(255,255,255,0.14)]'
                  : 'border-white/10 bg-white/5 text-white/80'
              }`}
            >
              {preset.label}
            </MotionButton>
          )
        })}
      </div>
    </section>
  )
}

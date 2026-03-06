import { motion } from 'framer-motion'
import { PRESETS } from '../lib/timerLogic'

const MotionButton = motion.button

export function PresetButtons({ selected, onSelect, title }) {
  return (
    <section className="space-y-2">
      <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-app-muted">{title}</p>
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
              className={`preset-chip whitespace-nowrap rounded-full border px-4 py-2.5 text-sm font-semibold transition ${
                active ? 'preset-chip-active' : 'preset-chip-idle'
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

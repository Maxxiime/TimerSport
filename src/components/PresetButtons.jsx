import { PRESETS } from '../lib/timerLogic'

export function PresetButtons({ selected, onSelect }) {
  return (
    <div>
      <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400">Presets</p>
      <div className="flex flex-wrap gap-2">
        {Object.entries(PRESETS).map(([key, preset]) => (
          <button
            key={key}
            type="button"
            onClick={() => onSelect(key)}
            className={`min-h-11 rounded-full border px-4 text-sm font-semibold transition ${
              selected === key ? 'border-white bg-white text-black' : 'border-zinc-700 bg-zinc-900 text-zinc-200'
            }`}
          >
            {preset.label}
          </button>
        ))}
      </div>
    </div>
  )
}

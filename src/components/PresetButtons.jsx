import { PRESETS } from '../lib/timerLogic'

export function PresetButtons({ selected, onSelect }) {
  return (
    <div>
      <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400">Presets</p>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {Object.entries(PRESETS).map(([key, preset]) => (
          <button
            key={key}
            type="button"
            onClick={() => onSelect(key)}
            className={`rounded-xl border px-4 py-3 text-sm font-semibold transition ${
              selected === key ? 'border-white bg-white text-black' : 'border-zinc-700 text-zinc-200 hover:border-zinc-500'
            }`}
          >
            {preset.label}
          </button>
        ))}
      </div>
    </div>
  )
}

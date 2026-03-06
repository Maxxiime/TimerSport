export function TimerControls({ isRunning, isPaused, onStart, onPause, onResume, onReset, labels, darkMode }) {
  if (!isRunning) {
    return (
      <button
        type="button"
        onClick={onStart}
        className="min-h-14 w-full rounded-2xl bg-work px-8 text-2xl font-black text-black shadow-[0_14px_30px_rgba(34,197,94,0.45)] transition hover:brightness-110"
      >
        {labels.startWorkout}
      </button>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-3">
      {isPaused ? (
        <button type="button" onClick={onResume} className="min-h-11 rounded-xl bg-work px-4 text-lg font-bold text-black">
          {labels.resume}
        </button>
      ) : (
        <button type="button" onClick={onPause} className="min-h-11 rounded-xl bg-amber-400 px-4 text-lg font-bold text-black">
          {labels.pause}
        </button>
      )}
      <button
        type="button"
        onClick={onReset}
        className={`min-h-11 rounded-xl px-4 text-lg font-bold ${darkMode ? 'bg-zinc-700 text-white' : 'bg-zinc-200 text-zinc-900'}`}
      >
        {labels.reset}
      </button>
    </div>
  )
}

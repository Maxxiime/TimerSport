export function TimerControls({ isRunning, isPaused, onStart, onPause, onResume, onReset }) {
  if (!isRunning) {
    return (
      <button
        type="button"
        onClick={onStart}
        className="min-h-14 w-full rounded-2xl bg-work px-8 text-2xl font-black text-black shadow-[0_14px_30px_rgba(34,197,94,0.45)] transition hover:brightness-110"
      >
        START WORKOUT
      </button>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-3">
      {isPaused ? (
        <button type="button" onClick={onResume} className="min-h-11 rounded-xl bg-work px-4 text-lg font-bold text-black">
          Resume
        </button>
      ) : (
        <button type="button" onClick={onPause} className="min-h-11 rounded-xl bg-amber-400 px-4 text-lg font-bold text-black">
          Pause
        </button>
      )}
      <button type="button" onClick={onReset} className="min-h-11 rounded-xl bg-zinc-700 px-4 text-lg font-bold text-white">
        Reset
      </button>
    </div>
  )
}

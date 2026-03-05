export function TimerControls({ isRunning, isPaused, onStart, onPause, onResume, onReset }) {
  if (!isRunning) {
    return (
      <button
        type="button"
        onClick={onStart}
        className="w-full rounded-2xl bg-work px-8 py-5 text-2xl font-black text-black shadow-xl transition hover:brightness-110"
      >
        START
      </button>
    )
  }

  return (
    <div className="grid grid-cols-3 gap-3">
      {isPaused ? (
        <button type="button" onClick={onResume} className="rounded-xl bg-work px-4 py-4 text-lg font-bold text-black">
          Resume
        </button>
      ) : (
        <button type="button" onClick={onPause} className="rounded-xl bg-amber-400 px-4 py-4 text-lg font-bold text-black">
          Pause
        </button>
      )}
      <button type="button" onClick={onReset} className="col-span-2 rounded-xl bg-zinc-700 px-4 py-4 text-lg font-bold text-white">
        Reset
      </button>
    </div>
  )
}

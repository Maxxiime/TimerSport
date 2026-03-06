import { motion } from 'framer-motion'

const MotionButton = motion.button

export function TimerControls({ isRunning, isPaused, onStart, onPause, onResume, onReset, labels, overlay = false }) {
  if (!isRunning) {
    return (
      <MotionButton
        type="button"
        onClick={onStart}
        whileTap={{ scale: 0.98 }}
        className="relative w-full overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-400 px-6 py-4 text-base font-black tracking-[0.18em] text-black shadow-[0_16px_40px_rgba(34,197,94,0.35)]"
      >
        <span className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/2 -skew-x-12 bg-white/30 blur-md animate-[sheen_2.8s_ease-in-out_infinite]" />
        <span className="relative">{labels.startWorkout}</span>
      </MotionButton>
    )
  }

  return (
    <div className={`grid gap-3 ${overlay ? 'grid-cols-2' : 'grid-cols-2'}`}>
      {isPaused ? (
        <MotionButton
          type="button"
          whileTap={{ scale: 0.96 }}
          onClick={onResume}
          className="rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-400 px-4 py-3 text-base font-bold text-black"
        >
          {labels.resume}
        </MotionButton>
      ) : (
        <MotionButton
          type="button"
          whileTap={{ scale: 0.96 }}
          onClick={onPause}
          className="rounded-2xl bg-amber-400 px-4 py-3 text-base font-bold text-black"
        >
          {labels.pause}
        </MotionButton>
      )}
      <MotionButton
        type="button"
        whileTap={{ scale: 0.96 }}
        onClick={onReset}
        className="rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-base font-bold text-white"
      >
        {labels.reset}
      </MotionButton>
    </div>
  )
}

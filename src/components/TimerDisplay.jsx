import { m } from 'framer-motion'
import { formatTime, nextPhase } from '../lib/timerLogic'

const MotionDiv = m.div
const MotionCircle = m.circle

export function TimerDisplay({ phase, remaining, round, rounds, phaseDuration, work, rest, fullscreen = false, labels }) {
  const safeDuration = Math.max(1, phaseDuration)
  const progress = Math.max(0, remaining / safeDuration)
  const radius = fullscreen ? 154 : 126
  const center = 170
  const circumference = 2 * Math.PI * radius
  const warning = remaining <= 5 && phase !== 'countdown'
  const viewBox = 340

  const phaseLabel = phase === 'work' ? labels.phaseWork : phase === 'rest' ? labels.phaseRest : labels.phaseGo

  const next = phase === 'countdown' ? labels.phaseWork : nextPhase(phase, rest)
  const nextLabel = next === 'work' ? labels.phaseWork : labels.phaseRest
  const nextTime = next === 'work' ? work : rest

  const ringGradient = warning ? 'url(#ringWarning)' : phase === 'work' ? 'url(#ringWork)' : 'url(#ringRest)'

  return (
    <div className={`flex w-full flex-col items-center justify-center text-center ${fullscreen ? 'gap-5' : 'gap-4'}`}>
      <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/55">
        {labels.roundLabel} {round} / {rounds}
      </p>

      <MotionDiv
        animate={warning ? { scale: [1, 1.02, 1] } : { scale: 1 }}
        transition={warning ? { repeat: Infinity, duration: 0.9, ease: 'easeInOut' } : { duration: 0.2 }}
        className="relative grid place-items-center"
        style={{ width: fullscreen ? 'min(88vw, 64vh)' : 'min(68vw, 40vh)', height: fullscreen ? 'min(88vw, 64vh)' : 'min(68vw, 40vh)' }}
      >
        <div className="absolute inset-0 rounded-full bg-white/[0.04] backdrop-blur-xl" />
        <svg viewBox={`0 0 ${viewBox} ${viewBox}`} className="h-full w-full -rotate-90">
          <defs>
            <linearGradient id="ringWork" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#22c55e" />
              <stop offset="100%" stopColor="#4ade80" />
            </linearGradient>
            <linearGradient id="ringRest" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#60a5fa" />
            </linearGradient>
            <linearGradient id="ringWarning" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fb923c" />
              <stop offset="100%" stopColor="#ef4444" />
            </linearGradient>
            <filter id="softGlow" x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur stdDeviation="5" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <circle cx={center} cy={center} r={radius} stroke="rgba(255,255,255,0.08)" strokeWidth="14" fill="none" />
          <MotionCircle
            cx={center}
            cy={center}
            r={radius}
            stroke={ringGradient}
            strokeWidth="15"
            strokeLinecap="round"
            fill="none"
            filter="url(#softGlow)"
            initial={false}
            animate={{ strokeDashoffset: circumference * (1 - progress) }}
            transition={{ duration: 0.35, ease: 'linear' }}
            strokeDasharray={circumference}
          />
        </svg>

        <div className="absolute space-y-2">
          <MotionDiv
            key={remaining}
            initial={{ scale: 0.985 }}
            animate={{ scale: [0.985, 1.015, 1] }}
            transition={{ duration: 0.36, ease: 'easeOut' }}
            className="text-[clamp(3.2rem,12vw,6.6rem)] font-extrabold leading-none tabular-nums text-white"
          >
            {formatTime(remaining)}
          </MotionDiv>
          <p className="text-sm font-semibold uppercase tracking-[0.34em] text-white/80">{phaseLabel}</p>
          <p className="text-xs font-medium text-white/50">
            {labels.next}: {nextLabel} {nextTime > 0 ? `• ${formatTime(nextTime)}` : ''}
          </p>
        </div>
      </MotionDiv>
    </div>
  )
}

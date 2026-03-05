import { m } from 'framer-motion'
import { formatTime } from '../lib/timerLogic'

const MotionDiv = m.div
const MotionCircle = m.circle

export function TimerDisplay({ phase, remaining, round, rounds, phaseDuration, gymMode, rest }) {
  const progress = Math.max(0, remaining / phaseDuration)
  const radius = gymMode ? 180 : 135
  const circumference = 2 * Math.PI * radius
  const stateColor = phase === 'work' ? '#22c55e' : phase === 'rest' ? '#3b82f6' : '#ffffff'
  const warning = remaining <= 5 && phase !== 'countdown'
  const nextState = phase === 'work' ? (rest > 0 ? 'REST' : 'WORK') : 'WORK'

  return (
    <div className="flex flex-col items-center justify-center gap-4 text-center">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-400">Round {round} / {rounds}</p>
      <MotionDiv
        animate={warning ? { scale: [1, 1.05, 1] } : { scale: 1 }}
        transition={warning ? { repeat: Infinity, duration: 0.8 } : { duration: 0.2 }}
        className="relative grid place-items-center"
      >
        <svg width={radius * 2 + 24} height={radius * 2 + 24} className="-rotate-90">
          <circle cx={radius + 12} cy={radius + 12} r={radius} stroke="#27272a" strokeWidth="12" fill="none" />
          <MotionCircle
            cx={radius + 12}
            cy={radius + 12}
            r={radius}
            stroke={warning ? '#ef4444' : stateColor}
            strokeWidth="14"
            strokeLinecap="round"
            fill="none"
            initial={false}
            animate={{ strokeDashoffset: circumference * (1 - progress) }}
            transition={{ duration: 0.4, ease: 'linear' }}
            strokeDasharray={circumference}
          />
        </svg>

        <MotionDiv className={`absolute ${warning ? 'text-warning drop-shadow-[0_0_24px_rgba(239,68,68,0.8)]' : ''}`}>
          <p className={`${gymMode ? 'text-8xl' : 'text-7xl'} font-black tabular-nums leading-none text-white`}>{formatTime(remaining)}</p>
          <p className={`mt-2 ${gymMode ? 'text-4xl' : 'text-2xl'} font-black tracking-wider`} style={{ color: warning ? '#ef4444' : stateColor }}>
            {phase.toUpperCase()}
          </p>
        </MotionDiv>
      </MotionDiv>
      <p className="text-lg font-semibold text-zinc-300">Next: {nextState}</p>
    </div>
  )
}

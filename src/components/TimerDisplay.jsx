import { m } from 'framer-motion'
import { formatTime } from '../lib/timerLogic'

const MotionDiv = m.div
const MotionCircle = m.circle

export function TimerDisplay({ phase, remaining, round, rounds, phaseDuration, fullscreen = false, labels, darkMode }) {
  const safeDuration = Math.max(1, phaseDuration)
  const progress = Math.max(0, remaining / safeDuration)
  const size = fullscreen ? 'min(92vw, 68vh)' : 'min(82vw, 48vh)'
  const radius = 150
  const center = 168
  const circumference = 2 * Math.PI * radius
  const stateColor = phase === 'work' ? '#22c55e' : phase === 'rest' ? '#3b82f6' : '#ffffff'
  const warning = remaining <= 5 && phase !== 'countdown'
  const activeColor = warning ? '#ef4444' : stateColor

  const phaseLabel = phase === 'work' ? labels.phaseWork : phase === 'rest' ? labels.phaseRest : labels.phaseGo

  return (
    <div className={`flex h-full flex-col items-center justify-center text-center ${fullscreen ? 'gap-5' : 'gap-3'}`}>
      <p className={`font-black uppercase tracking-[0.2em] ${darkMode ? 'text-zinc-400' : 'text-zinc-600'} ${fullscreen ? 'text-base' : 'text-xs'}`}>
        {labels.roundLabel} {round} / {rounds}
      </p>

      <MotionDiv
        animate={warning ? { scale: [1, 1.03, 1], filter: ['drop-shadow(0 0 10px rgba(239,68,68,0.2))', 'drop-shadow(0 0 22px rgba(239,68,68,0.75))', 'drop-shadow(0 0 10px rgba(239,68,68,0.2))'] } : { scale: 1 }}
        transition={warning ? { repeat: Infinity, duration: 0.95, ease: 'easeInOut' } : { duration: 0.2 }}
        className="relative grid place-items-center"
        style={{ width: size, height: size }}
      >
        <svg viewBox="0 0 336 336" className="h-full w-full -rotate-90">
          <circle cx={center} cy={center} r={radius} stroke={darkMode ? '#27272a' : '#d4d4d8'} strokeWidth="24" fill="none" />
          <MotionCircle
            cx={center}
            cy={center}
            r={radius}
            stroke={activeColor}
            strokeWidth={26}
            strokeLinecap="round"
            fill="none"
            initial={false}
            animate={{ strokeDashoffset: circumference * (1 - progress), filter: warning ? 'drop-shadow(0 0 10px #ef4444)' : `drop-shadow(0 0 10px ${activeColor})` }}
            transition={{ duration: 0.35, ease: 'linear' }}
            strokeDasharray={circumference}
          />
        </svg>

        <MotionDiv className="absolute">
          <p className={`${fullscreen ? 'text-[clamp(4.5rem,18vw,8.5rem)]' : 'text-[clamp(3.7rem,15vw,7rem)]'} font-black tabular-nums leading-none ${darkMode ? 'text-white' : 'text-zinc-900'}`}>
            {formatTime(remaining)}
          </p>
          <p className={`mt-2 font-black tracking-[0.24em] ${fullscreen ? 'text-4xl' : 'text-2xl'}`} style={{ color: activeColor }}>
            {phaseLabel}
          </p>
        </MotionDiv>
      </MotionDiv>
    </div>
  )
}

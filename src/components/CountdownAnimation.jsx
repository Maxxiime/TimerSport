import { AnimatePresence, m } from 'framer-motion'

const MotionDiv = m.div

export function CountdownAnimation({ value }) {
  const label = value === 0 ? 'GO' : value

  return (
    <AnimatePresence mode="wait">
      <MotionDiv
        key={label}
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: [0.82, 1.06, 1], opacity: 1 }}
        exit={{ scale: 1.34, opacity: 0 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
        className="text-center text-[clamp(5rem,26vw,11rem)] font-extrabold text-white"
      >
        {label}
      </MotionDiv>
    </AnimatePresence>
  )
}

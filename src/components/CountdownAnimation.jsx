import { AnimatePresence, m } from 'framer-motion'

const MotionDiv = m.div

export function CountdownAnimation({ value }) {
  const label = value === 0 ? 'GO' : value

  return (
    <AnimatePresence mode="wait">
      <MotionDiv
        key={label}
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: [0.8, 1.08, 1], opacity: 1 }}
        exit={{ scale: 1.45, opacity: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="text-center text-[clamp(5rem,30vw,13rem)] font-black text-white"
      >
        {label}
      </MotionDiv>
    </AnimatePresence>
  )
}

import { AnimatePresence, m } from 'framer-motion'

const MotionDiv = m.div

export function CountdownAnimation({ value }) {
  const label = value === 0 ? 'GO' : value

  return (
    <AnimatePresence mode="wait">
      <MotionDiv
        key={label}
        initial={{ scale: 0.45, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 1.5, opacity: 0 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
        className="text-center text-8xl font-black text-white sm:text-9xl"
      >
        {label}
      </MotionDiv>
    </AnimatePresence>
  )
}

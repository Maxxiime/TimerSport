export const PRESETS = {
  hiit3030: { label: 'HIT 30/30', work: 30, rest: 30, rounds: 10 },
  emom: { label: 'EMOM', work: 60, rest: 0, rounds: 10 },
  custom: { label: 'Custom', work: 30, rest: 30, rounds: 10 },
}

export const nextPhase = (phase, rest) => {
  if (phase === 'countdown') return 'work'
  if (phase === 'work') return rest > 0 ? 'rest' : 'work'
  return 'work'
}

export const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
}

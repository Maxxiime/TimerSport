const clamp = (value, min, max, fallback) => {
  const num = Number(value)
  if (Number.isNaN(num)) return fallback
  return Math.max(min, Math.min(max, Math.floor(num)))
}

export const parseWorkoutFromHash = (hash) => {
  const query = hash.startsWith('#') ? hash.slice(1) : hash
  const params = new URLSearchParams(query)
  if (!params.toString()) return null

  const work = clamp(params.get('work'), 1, 600, 30)
  const rest = clamp(params.get('rest'), 0, 600, 30)
  const rounds = clamp(params.get('rounds'), 1, 100, 10)
  const countdown = clamp(params.get('countdown'), 0, 10, 3)

  return { work, rest, rounds, countdown, preset: 'custom' }
}

export const createShareHash = ({ work, rest, rounds, countdown }) => {
  const params = new URLSearchParams({
    work: String(work),
    rest: String(rest),
    rounds: String(rounds),
    countdown: String(countdown),
  })

  return `#${params.toString()}`
}

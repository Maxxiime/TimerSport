const KEY = 'timer-sport-settings-v1'

export const defaultSettings = {
  preset: 'hiit3030',
  work: 30,
  rest: 30,
  rounds: 10,
  countdown: 3,
  voice: false,
  beep: true,
  vibration: true,
  gymMode: false,
}

export const loadSettings = () => {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return defaultSettings
    return { ...defaultSettings, ...JSON.parse(raw) }
  } catch {
    return defaultSettings
  }
}

export const saveSettings = (settings) => {
  localStorage.setItem(KEY, JSON.stringify(settings))
}

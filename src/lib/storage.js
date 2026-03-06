import { detectLanguage } from './i18n'

const KEY = 'timer-sport-settings-v2'

const detectDarkMode = () => {
  if (typeof window === 'undefined' || !window.matchMedia) return true
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

export const defaultSettings = {
  preset: 'hiit3030',
  work: 30,
  rest: 30,
  rounds: 10,
  countdown: 3,
  voice: false,
  beep: true,
  vibration: true,
  gymMode: true,
  darkMode: detectDarkMode(),
  language: detectLanguage(),
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

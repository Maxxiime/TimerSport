import { detectLanguage } from './i18n'

const KEY = 'timer-sport-settings-v2'

const detectDarkMode = () => {
  if (typeof window === 'undefined' || !window.matchMedia) return true
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

const defaultLanguage = detectLanguage()

export const defaultSettings = {
  preset: 'hiit3030',
  work: 30,
  rest: 30,
  rounds: 10,
  countdown: 3,
  voice: false,
  voiceLanguage: defaultLanguage,
  beep: true,
  darkMode: detectDarkMode(),
  language: defaultLanguage,
}

export const loadSettings = () => {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return defaultSettings
    const parsed = { ...defaultSettings, ...JSON.parse(raw) }
    return { ...parsed, voiceLanguage: parsed.language }
  } catch {
    return defaultSettings
  }
}

export const saveSettings = (settings) => {
  localStorage.setItem(KEY, JSON.stringify(settings))
}

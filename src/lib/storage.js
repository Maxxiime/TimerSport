import { detectLanguage } from './i18n'

const KEY = 'timer-sport-settings-v2'
export const THEME_PREFERENCE_KEY = 'timerSport_theme'
export const LANGUAGE_PREFERENCE_KEY = 'timerSport_language'

const detectDarkMode = () => {
  if (typeof window === 'undefined' || !window.matchMedia) return true
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

const getSavedThemePreference = () => {
  const value = localStorage.getItem(THEME_PREFERENCE_KEY)
  if (value === 'dark' || value === 'light') return value
  return null
}

const getSavedLanguagePreference = () => {
  const value = localStorage.getItem(LANGUAGE_PREFERENCE_KEY)
  if (value === 'en' || value === 'fr' || value === 'es') return value
  return null
}

const defaultLanguage = detectLanguage()

export const defaultSettings = {
  preset: 'hiit30',
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
    const parsed = raw ? { ...defaultSettings, ...JSON.parse(raw) } : { ...defaultSettings }

    const savedTheme = getSavedThemePreference()
    const savedLanguage = getSavedLanguagePreference()

    const language = savedLanguage || detectLanguage()
    const darkMode = savedTheme ? savedTheme === 'dark' : detectDarkMode()

    return {
      ...parsed,
      darkMode,
      language,
      voiceLanguage: language,
    }
  } catch {
    return defaultSettings
  }
}

export const saveSettings = (settings) => {
  localStorage.setItem(KEY, JSON.stringify(settings))
}

export const saveThemePreference = (darkMode) => {
  localStorage.setItem(THEME_PREFERENCE_KEY, darkMode ? 'dark' : 'light')
}

export const saveLanguagePreference = (language) => {
  localStorage.setItem(LANGUAGE_PREFERENCE_KEY, language)
}

export const hasSavedThemePreference = () => Boolean(getSavedThemePreference())

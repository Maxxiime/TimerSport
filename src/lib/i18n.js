export const TRANSLATIONS = {
  en: {
    title: 'TimerSport',
    subtitle: 'Mobile CrossFit interval timer',
    presets: 'Presets',
    quickConfig: 'Quick config',
    workSeconds: 'WORK seconds',
    restSeconds: 'REST seconds',
    rounds: 'ROUNDS',
    countdown: 'Countdown',
    options: 'Options',
    voiceCues: 'Voice cues',
    beepSounds: 'Beep sounds',
    theme: 'Theme',
    darkMode: 'Dark mode',
    lightMode: 'Light mode',
    language: 'Language',
    voiceLanguage: 'Voice language',
    more: 'More',
    next: 'Next',
    startWorkout: 'START WORKOUT',
    resume: 'Resume',
    pause: 'Pause',
    reset: 'Reset',
    roundLabel: 'ROUND',
    phaseWork: 'WORK',
    phaseRest: 'REST',
    phaseGo: 'GO',
    voiceWork: 'Work',
    voiceRest: 'Rest',
    voiceGo: 'GO',
    workoutComplete: 'Workout complete',
    languageName: 'English',
  },
  fr: {
    title: 'TimerSport',
    subtitle: 'Timer intervalle CrossFit mobile',
    presets: 'Préréglages',
    quickConfig: 'Config rapide',
    workSeconds: 'Secondes EFFORT',
    restSeconds: 'Secondes REPOS',
    rounds: 'TOURS',
    countdown: 'Décompte',
    options: 'Options',
    voiceCues: 'Guidage vocal',
    beepSounds: 'Bips sonores',
    theme: 'Thème',
    darkMode: 'Mode sombre',
    lightMode: 'Mode clair',
    language: 'Langue',
    voiceLanguage: 'Langue de la voix',
    more: 'Plus',
    next: 'Suivant',
    startWorkout: "DÉMARRER L'ENTRAÎNEMENT",
    resume: 'Reprendre',
    pause: 'Pause',
    reset: 'Réinitialiser',
    roundLabel: 'TOUR',
    phaseWork: 'EFFORT',
    phaseRest: 'REPOS',
    phaseGo: 'GO',
    voiceWork: 'Travail',
    voiceRest: 'Repos',
    voiceGo: 'GO',
    workoutComplete: 'Entraînement terminé',
    languageName: 'Français',
  },
  es: {
    title: 'TimerSport',
    subtitle: 'Temporizador móvil de intervalos CrossFit',
    presets: 'Preajustes',
    quickConfig: 'Ajuste rápido',
    workSeconds: 'Segundos TRABAJO',
    restSeconds: 'Segundos DESCANSO',
    rounds: 'RONDAS',
    countdown: 'Cuenta atrás',
    options: 'Opciones',
    voiceCues: 'Indicaciones de voz',
    beepSounds: 'Sonidos beep',
    theme: 'Tema',
    darkMode: 'Modo oscuro',
    lightMode: 'Modo claro',
    language: 'Idioma',
    voiceLanguage: 'Idioma de voz',
    more: 'Más',
    next: 'Siguiente',
    startWorkout: 'INICIAR ENTRENAMIENTO',
    resume: 'Continuar',
    pause: 'Pausar',
    reset: 'Reiniciar',
    roundLabel: 'RONDA',
    phaseWork: 'TRABAJO',
    phaseRest: 'DESCANSO',
    phaseGo: 'GO',
    voiceWork: 'Trabajo',
    voiceRest: 'Descanso',
    voiceGo: 'GO',
    workoutComplete: 'Entrenamiento completado',
    languageName: 'Español',
  },
}

export const SUPPORTED_LANGUAGES = ['en', 'fr', 'es']

export const detectLanguage = () => {
  if (typeof navigator === 'undefined') return 'en'

  const locales = [
    ...(Array.isArray(navigator.languages) ? navigator.languages : []),
    navigator.language,
  ]
    .filter(Boolean)
    .map((locale) => locale.toLowerCase())

  const hasFrench = locales.some((locale) => locale.startsWith('fr'))
  if (hasFrench) return 'fr'

  const hasSpanish = locales.some((locale) => locale.startsWith('es'))
  if (hasSpanish) return 'es'

  return 'en'
}

export const getTranslation = (language) => TRANSLATIONS[language] || TRANSLATIONS.en

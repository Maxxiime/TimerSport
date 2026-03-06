import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { nextPhase } from '../lib/timerLogic'

const languageVoices = {
  en: 'en-US',
  fr: 'fr-FR',
  es: 'es-ES',
}

const phaseVoiceTranslations = {
  en: {
    work: 'Work',
    rest: 'Rest',
  },
  fr: {
    work: 'Travail',
    rest: 'Repos',
  },
  es: {
    work: 'Trabajo',
    rest: 'Descanso',
  },
}

export function useTimer(config, labels) {
  const { work, rest, rounds, countdown, voice, beep, language } = config
  const [isRunning, setIsRunning] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [activeView, setActiveView] = useState('config')
  const [phase, setPhase] = useState('countdown')
  const [remaining, setRemaining] = useState(countdown)
  const [round, setRound] = useState(1)
  const tickerRef = useRef(null)
  const voicesRef = useRef([])
  const lastSpokenTickRef = useRef(null)

  const speechLocale = useMemo(() => languageVoices[language] || languageVoices.en, [language])
  const phaseVoiceLabels = useMemo(() => phaseVoiceTranslations[language] || phaseVoiceTranslations.en, [language])

  const getVoiceForLocale = useCallback(
    (voices, locale) => {
      if (!voices.length) return null
      const exact = voices.find((item) => item.lang?.toLowerCase() === locale.toLowerCase())
      if (exact) return exact

      const shortCode = locale.split('-')[0].toLowerCase()
      return voices.find((item) => item.lang?.toLowerCase().startsWith(shortCode)) || null
    },
    [],
  )

  const speak = useCallback(
    (text, lang = speechLocale) => {
      if (!voice || !window.speechSynthesis) return
      const synthesis = window.speechSynthesis
      const utterance = new SpeechSynthesisUtterance(String(text))
      const voices = voicesRef.current.length ? voicesRef.current : synthesis.getVoices()
      const matchingVoice = getVoiceForLocale(voices, lang)

      utterance.lang = lang
      if (matchingVoice) utterance.voice = matchingVoice
      utterance.rate = 1
      utterance.pitch = 1

      synthesis.cancel()
      synthesis.resume()
      synthesis.speak(utterance)
    },
    [voice, speechLocale, getVoiceForLocale],
  )

  useEffect(() => {
    if (!window.speechSynthesis) return

    const hydrateVoices = () => {
      voicesRef.current = window.speechSynthesis.getVoices()
    }

    hydrateVoices()
    window.speechSynthesis.addEventListener('voiceschanged', hydrateVoices)

    return () => {
      window.speechSynthesis.removeEventListener('voiceschanged', hydrateVoices)
    }
  }, [])

  useEffect(() => {
    if (!window.speechSynthesis) return
    voicesRef.current = window.speechSynthesis.getVoices()
  }, [speechLocale])

  const beepNow = useCallback(() => {
    if (!beep) return
    const ctx = new (window.AudioContext || window.webkitAudioContext)()
    const oscillator = ctx.createOscillator()
    const gain = ctx.createGain()
    oscillator.connect(gain)
    gain.connect(ctx.destination)
    oscillator.frequency.value = 880
    gain.gain.value = 0.1
    oscillator.start()
    oscillator.stop(ctx.currentTime + 0.12)
  }, [beep])

  const reset = () => {
    clearInterval(tickerRef.current)
    lastSpokenTickRef.current = null
    setIsRunning(false)
    setIsPaused(false)
    setActiveView('config')
    setPhase('countdown')
    setRound(1)
    setRemaining(countdown)
  }

  const start = async () => {
    setActiveView('timer')
    if (document.documentElement.requestFullscreen) {
      try {
        await document.documentElement.requestFullscreen()
      } catch {
        // noop
      }
    }
    setIsRunning(true)
    setIsPaused(false)
    setRound(1)
    lastSpokenTickRef.current = null

    if (window.speechSynthesis) {
      window.speechSynthesis.cancel()
      window.speechSynthesis.resume()
    }

    if (countdown > 0) {
      setPhase('countdown')
      setRemaining(countdown)
      speak(String(countdown))
      beepNow()
    } else {
      setPhase('work')
      setRemaining(work)
      speak(phaseVoiceLabels.work)
    }
  }

  const pause = () => setIsPaused(true)
  const resume = () => setIsPaused(false)

  useEffect(() => {
    if (!isRunning || isPaused) return

    tickerRef.current = setInterval(() => {
      setRemaining((prev) => {
        if (prev > 1) {
          const nextSecond = prev - 1

          if (voice && nextSecond > 0) {
            const tickKey = `${phase}-${nextSecond}`
            const shouldSpeakCountdown = phase === 'countdown'
            const shouldSpeakIntervalFinalSeconds = (phase === 'work' || phase === 'rest') && nextSecond <= 5

            if ((shouldSpeakCountdown || shouldSpeakIntervalFinalSeconds) && lastSpokenTickRef.current !== tickKey) {
              speak(String(nextSecond))
              lastSpokenTickRef.current = tickKey
            }
          }

          if (phase === 'countdown') {
            beepNow()
          } else if (nextSecond <= 5) {
            beepNow()
          }

          return nextSecond
        }

        if (phase === 'countdown') {
          lastSpokenTickRef.current = null
          speak(phaseVoiceLabels.work)
          beepNow()
          setPhase('work')
          return work
        }

        const phaseAfter = nextPhase(phase, rest)
        if (phase === 'work' && phaseAfter === 'rest') {
          lastSpokenTickRef.current = null
          speak(phaseVoiceLabels.rest)
          beepNow()
          setPhase('rest')
          return rest
        }

        if (phase === 'rest' || (phase === 'work' && rest === 0)) {
          if (round >= rounds) {
            speak(labels.workoutComplete)
            clearInterval(tickerRef.current)
            setIsRunning(false)
            setIsPaused(false)
            setActiveView('config')
            lastSpokenTickRef.current = null
            return countdown
          }
          setRound((r) => r + 1)
          setPhase('work')
          lastSpokenTickRef.current = null
          speak(phaseVoiceLabels.work)
          beepNow()
          return work
        }

        return prev
      })
    }, 1000)

    return () => clearInterval(tickerRef.current)
  }, [isRunning, isPaused, phase, work, rest, rounds, countdown, round, beepNow, speak, phaseVoiceLabels, voice, labels.workoutComplete])

  const phaseDuration = useMemo(() => {
    if (phase === 'countdown') return countdown || 1
    if (phase === 'work') return work
    return rest || 1
  }, [countdown, phase, rest, work])

  return {
    start,
    pause,
    resume,
    reset,
    isRunning,
    isPaused,
    activeView,
    phase,
    remaining,
    round,
    phaseDuration,
  }
}

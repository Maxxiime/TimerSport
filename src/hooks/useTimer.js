import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { nextPhase } from '../lib/timerLogic'

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

  const speechLocale = useMemo(() => {
    if (language === 'fr') return 'fr-FR'
    if (language === 'es') return 'es-ES'
    return 'en-US'
  }, [language])

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
    (text, { interrupt = true } = {}) => {
      if (!voice || !window.speechSynthesis) return
      const synthesis = window.speechSynthesis
      const utterance = new SpeechSynthesisUtterance(String(text))
      const voices = voicesRef.current.length ? voicesRef.current : synthesis.getVoices()
      const matchingVoice = getVoiceForLocale(voices, speechLocale)

      utterance.lang = speechLocale
      if (matchingVoice) utterance.voice = matchingVoice
      utterance.rate = 1

      if (interrupt) synthesis.cancel()
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

    if (window.speechSynthesis) {
      window.speechSynthesis.cancel()
      window.speechSynthesis.resume()
    }

    if (countdown > 0) {
      setPhase('countdown')
      setRemaining(countdown)
    } else {
      setPhase('work')
      setRemaining(work)
      speak(labels.voiceWork || labels.phaseWork)
    }
  }

  const pause = () => setIsPaused(true)
  const resume = () => setIsPaused(false)

  useEffect(() => {
    if (!isRunning || isPaused) return

    tickerRef.current = setInterval(() => {
      setRemaining((prev) => {
        if (prev > 1) {
          if (prev <= 6) {
            beepNow()
            speak(String(prev - 1))
          }
          return prev - 1
        }

        if (phase === 'countdown') {
          speak(labels.voiceGo || labels.phaseGo)
          beepNow()
          setPhase('work')
          return work
        }

        const phaseAfter = nextPhase(phase, rest)
        if (phase === 'work' && phaseAfter === 'rest') {
          speak(labels.voiceRest || labels.phaseRest)
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
            return countdown
          }
          setRound((r) => r + 1)
          setPhase('work')
          speak(labels.voiceWork || labels.phaseWork)
          beepNow()
          return work
        }

        return prev
      })
    }, 1000)

    return () => clearInterval(tickerRef.current)
  }, [isRunning, isPaused, phase, work, rest, rounds, countdown, round, beepNow, speak, labels])

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

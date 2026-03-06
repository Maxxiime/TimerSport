import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { nextPhase } from '../lib/timerLogic'

export function useTimer(config, labels) {
  const { work, rest, rounds, countdown, voice, beep, vibration } = config
  const [isRunning, setIsRunning] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [activeView, setActiveView] = useState('config')
  const [phase, setPhase] = useState('countdown')
  const [remaining, setRemaining] = useState(countdown)
  const [round, setRound] = useState(1)
  const tickerRef = useRef(null)

  const speak = useCallback(
    (text) => {
      if (!voice || !window.speechSynthesis) return
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = 1
      window.speechSynthesis.cancel()
      window.speechSynthesis.speak(utterance)
    },
    [voice],
  )

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

  const vibrateNow = useCallback(
    (duration = 120) => {
      if (vibration && navigator.vibrate) navigator.vibrate(duration)
    },
    [vibration],
  )

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
    if (countdown > 0) {
      setPhase('countdown')
      setRemaining(countdown)
    } else {
      setPhase('work')
      setRemaining(work)
      speak(labels.phaseWork)
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
            vibrateNow(80)
            speak(String(prev - 1))
          }
          return prev - 1
        }

        if (phase === 'countdown') {
          speak(labels.phaseGo)
          beepNow()
          vibrateNow(150)
          setPhase('work')
          return work
        }

        const phaseAfter = nextPhase(phase, rest)
        if (phase === 'work' && phaseAfter === 'rest') {
          speak(labels.phaseRest)
          beepNow()
          vibrateNow(140)
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
          speak(labels.phaseWork)
          beepNow()
          vibrateNow(140)
          return work
        }

        return prev
      })
    }, 1000)

    return () => clearInterval(tickerRef.current)
  }, [isRunning, isPaused, phase, work, rest, rounds, countdown, round, beepNow, speak, vibrateNow, labels])

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

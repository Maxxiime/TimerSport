import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { CountdownAnimation } from './components/CountdownAnimation'
import { PresetButtons } from './components/PresetButtons'
import { TimerControls } from './components/TimerControls'
import { TimerDisplay } from './components/TimerDisplay'
import { WheelNumberPicker } from './components/WheelNumberPicker'
import { useTimer } from './hooks/useTimer'
import { useWakeLock } from './hooks/useWakeLock'
import { getTranslation, SUPPORTED_LANGUAGES } from './lib/i18n'
import { loadSettings, saveSettings } from './lib/storage'
import { PRESETS } from './lib/timerLogic'
import { createShareHash, parseWorkoutFromHash } from './lib/workoutParser'

const MotionSection = motion.section
const MotionDiv = motion.div
const countdownOptions = [0, 3, 5, 10]

const languageFlags = {
  en: '🇺🇸',
  fr: '🇫🇷',
  es: '🇪🇸',
}

function App() {
  const hashPreset = parseWorkoutFromHash(window.location.hash)
  const [settings, setSettings] = useState({ ...loadSettings(), ...hashPreset })

  const labels = useMemo(() => getTranslation(settings.language), [settings.language])
  const timer = useTimer(settings, labels)
  useWakeLock(timer.isRunning)

  const onLanguageChange = (language) => {
    setSettings((prev) => ({ ...prev, language, voiceLanguage: language }))
  }

  const toggleTheme = () => {
    setSettings((prev) => ({ ...prev, darkMode: !prev.darkMode }))
  }

  useEffect(() => {
    saveSettings(settings)
    window.history.replaceState(null, '', createShareHash(settings))
  }, [settings])

  useEffect(() => {
    document.documentElement.classList.toggle('dark', settings.darkMode)
  }, [settings.darkMode])

  const onPreset = (key) => {
    const preset = PRESETS[key]
    setSettings((prev) => ({ ...prev, preset: key, work: preset.work, rest: preset.rest, rounds: preset.rounds }))
  }

  const setWheelValue = (key) => (value) => {
    setSettings((prev) => ({ ...prev, preset: 'custom', [key]: value }))
  }

  const isCountdown = timer.phase === 'countdown' && settings.countdown > 0

  const toggleChips = [
    ['voice', labels.voiceCues],
    ['beep', labels.beepSounds],
  ]

  return (
    <main className="min-h-screen bg-app text-app-text transition-colors duration-200">
      <div className="mx-auto flex min-h-screen w-full max-w-md flex-col gap-3 px-4 pb-4 pt-4">
        <header className="relative space-y-3">
          <div className="absolute right-0 top-0 flex items-center gap-2">
            <div className="language-select-wrap relative w-12">
              <select
                value={settings.language}
                onChange={(e) => onLanguageChange(e.target.value)}
                className="app-select h-8 w-full rounded-lg px-0 text-center text-base font-semibold text-app-text outline-none transition"
                aria-label={labels.language}
              >
                {SUPPORTED_LANGUAGES.map((language) => (
                  <option key={language} value={language}>
                    {languageFlags[language]}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="button"
              onClick={toggleTheme}
              className="app-icon-button h-8 w-8 rounded-lg text-base"
              aria-label={labels.themeToggle}
            >
              {settings.darkMode ? '☀️' : '🌙'}
            </button>
          </div>

          <div className="space-y-1 pr-44">
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-app-muted">Fitness Interval Timer</p>
            <h1 className="text-xl font-bold tracking-tight text-app-text">{labels.title}</h1>
            <p className="text-xs text-app-subtle">{labels.subtitle}</p>
          </div>

          <div className="flex flex-wrap gap-2">
            {toggleChips.map(([key, label]) => (
              <button
                key={key}
                type="button"
                onClick={() => setSettings((prev) => ({ ...prev, [key]: !prev[key] }))}
                className={`rounded-full border px-3 py-2 text-xs font-semibold transition ${
                  settings[key] ? 'preset-chip-active text-app-text' : 'preset-chip-idle text-app-subtle'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </header>

        <AnimatePresence>
          {!timer.isRunning && (
            <MotionDiv initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} className="space-y-3">
              <PresetButtons selected={settings.preset} onSelect={onPreset} title={labels.presets} />

              <MotionSection className="glass-card space-y-3 p-4" layout>
                <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-app-muted">{labels.quickConfig}</p>
                <div className="grid grid-cols-3 gap-2 items-start">
                  {[
                    { key: 'work', label: labels.workSeconds, min: 1, max: 600 },
                    { key: 'rest', label: labels.restSeconds, min: 0, max: 600 },
                    { key: 'rounds', label: labels.rounds, min: 1, max: 100 },
                  ].map((item) => (
                    <WheelNumberPicker
                      key={item.key}
                      label={item.label}
                      value={settings[item.key]}
                      min={item.min}
                      max={item.max}
                      onChange={setWheelValue(item.key)}
                    />
                  ))}
                </div>
              </MotionSection>

              <MotionSection className="glass-card space-y-3 p-4" layout>
                <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-app-muted">{labels.countdown}</p>
                <div className="countdown-group relative grid grid-cols-4 rounded-2xl p-1">
                  <MotionDiv
                    className="countdown-active absolute bottom-1 top-1 rounded-xl"
                    animate={{ left: `calc(${countdownOptions.indexOf(settings.countdown) * 25}% + 4px)`, width: 'calc(25% - 8px)' }}
                    transition={{ type: 'spring', stiffness: 320, damping: 32 }}
                  />
                  {countdownOptions.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setSettings((prev) => ({ ...prev, countdown: c }))}
                      className="relative z-10 rounded-xl py-2 text-sm font-bold text-app-subtle"
                    >
                      {c === 0 ? 'OFF' : `${c}s`}
                    </button>
                  ))}
                </div>
              </MotionSection>

              <section className="glass-card p-3">
                <TimerDisplay
                  phase="work"
                  remaining={settings.work}
                  round={1}
                  rounds={settings.rounds}
                  phaseDuration={settings.work}
                  work={settings.work}
                  rest={settings.rest}
                  darkMode={settings.darkMode}
                  labels={labels}
                />
              </section>
            </MotionDiv>
          )}
        </AnimatePresence>

        {!timer.isRunning && (
          <div className="mt-auto pb-2">
            <TimerControls
              isRunning={timer.isRunning}
              isPaused={timer.isPaused}
              onStart={timer.start}
              onPause={timer.pause}
              onResume={timer.resume}
              onReset={timer.reset}
              labels={labels}
            />
          </div>
        )}

        <AnimatePresence>
          {timer.isRunning && (
            <MotionDiv
              key="overlay"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.32, ease: 'easeOut' }}
              className="fixed inset-0 z-40 flex flex-col bg-[#080a0d]/95 px-4 pb-6 pt-8"
            >
              <div className="mx-auto flex h-full w-full max-w-md flex-col justify-between">
                <div className="space-y-1 text-center">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/55">
                    {labels.roundLabel} {timer.round} / {settings.rounds}
                  </p>
                </div>

                <div className="grid flex-1 place-items-center">
                  {isCountdown ? (
                    <CountdownAnimation value={timer.remaining} />
                  ) : (
                    <TimerDisplay
                      phase={timer.phase}
                      remaining={timer.remaining}
                      round={timer.round}
                      rounds={settings.rounds}
                      phaseDuration={timer.phaseDuration}
                      work={settings.work}
                      rest={settings.rest}
                      fullscreen
                      darkMode={settings.darkMode}
                      labels={labels}
                    />
                  )}
                </div>

                <TimerControls
                  isRunning={timer.isRunning}
                  isPaused={timer.isPaused}
                  onStart={timer.start}
                  onPause={timer.pause}
                  onResume={timer.resume}
                  onReset={timer.reset}
                  labels={labels}
                  overlay
                />
              </div>
            </MotionDiv>
          )}
        </AnimatePresence>
      </div>
    </main>
  )
}

export default App

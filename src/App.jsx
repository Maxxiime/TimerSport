import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { CountdownAnimation } from './components/CountdownAnimation'
import { PresetButtons } from './components/PresetButtons'
import { TimerControls } from './components/TimerControls'
import { TimerDisplay } from './components/TimerDisplay'
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

  const setNum = (key, min, max) => (e) => {
    const raw = Number(e.target.value)
    const value = Number.isNaN(raw) ? min : Math.max(min, Math.min(max, Math.floor(raw)))
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
        <header className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-app-muted">Fitness Interval Timer</p>
            <h1 className="text-xl font-bold tracking-tight text-app-text">{labels.title}</h1>
            <p className="text-xs text-app-subtle">{labels.subtitle}</p>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="glass-card-light flex flex-col gap-1 p-1.5">
              {SUPPORTED_LANGUAGES.map((language) => (
                <button
                  key={language}
                  type="button"
                  onClick={() => setSettings((prev) => ({ ...prev, language }))}
                  className={`rounded-lg px-2 py-1 text-lg leading-none transition ${
                    settings.language === language ? 'bg-white/25' : 'opacity-65 hover:opacity-100'
                  }`}
                  aria-label={`${labels.language}: ${getTranslation(language).languageName}`}
                >
                  {languageFlags[language]}
                </button>
              ))}
            </div>

            <div className="glass-card-light flex flex-col gap-1 p-1.5">
              <button
                type="button"
                onClick={() => setSettings((prev) => ({ ...prev, darkMode: true }))}
                className={`rounded-lg px-2 py-1 text-xs font-semibold ${settings.darkMode ? 'bg-white/25' : 'opacity-65 hover:opacity-100'}`}
              >
                🌙
              </button>
              <button
                type="button"
                onClick={() => setSettings((prev) => ({ ...prev, darkMode: false }))}
                className={`rounded-lg px-2 py-1 text-xs font-semibold ${!settings.darkMode ? 'bg-white/25' : 'opacity-65 hover:opacity-100'}`}
              >
                ☀️
              </button>
            </div>
          </div>
        </header>

        <AnimatePresence>
          {!timer.isRunning && (
            <MotionDiv initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} className="space-y-3">
              <PresetButtons selected={settings.preset} onSelect={onPreset} title={labels.presets} />

              <MotionSection className="glass-card space-y-3 p-4" layout>
                <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-app-muted">{labels.quickConfig}</p>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { key: 'work', label: labels.workSeconds, min: 1, max: 600 },
                    { key: 'rest', label: labels.restSeconds, min: 0, max: 600 },
                    { key: 'rounds', label: labels.rounds, min: 1, max: 100 },
                  ].map((item) => (
                    <label key={item.key} className="space-y-2">
                      <span className="block text-[10px] font-semibold uppercase tracking-[0.2em] text-app-muted">{item.label}</span>
                      <input
                        type="number"
                        className="h-12 w-full rounded-2xl border border-white/10 bg-black/20 px-3 text-center text-2xl font-extrabold text-app-text outline-none focus:border-white/35 dark:bg-black/20"
                        value={settings[item.key]}
                        onChange={setNum(item.key, item.min, item.max)}
                      />
                    </label>
                  ))}
                </div>
              </MotionSection>

              <MotionSection className="glass-card space-y-3 p-4" layout>
                <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-app-muted">{labels.countdown}</p>
                <div className="relative grid grid-cols-4 rounded-2xl border border-white/10 bg-black/20 p-1 dark:bg-black/20">
                  <MotionDiv
                    className="absolute bottom-1 top-1 rounded-xl bg-white/15"
                    animate={{ left: `calc(${countdownOptions.indexOf(settings.countdown) * 25}% + 4px)`, width: 'calc(25% - 8px)' }}
                    transition={{ type: 'spring', stiffness: 320, damping: 32 }}
                  />
                  {countdownOptions.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setSettings((prev) => ({ ...prev, countdown: c }))}
                      className="relative z-10 rounded-xl py-2 text-sm font-bold text-app-text/85"
                    >
                      {c === 0 ? 'OFF' : `${c}s`}
                    </button>
                  ))}
                </div>
              </MotionSection>

              <MotionSection className="glass-card space-y-3 p-4" layout>
                <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-app-muted">{labels.options}</p>
                <div className="flex flex-wrap gap-2">
                  {toggleChips.map(([key, label]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setSettings((prev) => ({ ...prev, [key]: !prev[key] }))}
                      className={`rounded-full border px-3 py-2 text-xs font-semibold ${
                        settings[key] ? 'border-white/30 bg-white/20 text-app-text' : 'border-white/10 bg-white/5 text-app-subtle'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>

                <div className="space-y-2 border-t border-white/10 pt-3">
                  <span className="text-xs text-app-subtle">{labels.voiceLanguage}</span>
                  <div className="flex gap-2">
                    {SUPPORTED_LANGUAGES.map((voiceLanguage) => (
                      <button
                        key={voiceLanguage}
                        type="button"
                        onClick={() => setSettings((prev) => ({ ...prev, voiceLanguage }))}
                        className={`rounded-full border px-3 py-1.5 text-sm font-semibold ${
                          settings.voiceLanguage === voiceLanguage
                            ? 'border-white/30 bg-white/20 text-app-text'
                            : 'border-white/10 bg-white/5 text-app-subtle'
                        }`}
                        aria-label={`${labels.voiceLanguage}: ${getTranslation(voiceLanguage).languageName}`}
                      >
                        {languageFlags[voiceLanguage]} {getTranslation(voiceLanguage).languageName}
                      </button>
                    ))}
                  </div>
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

import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, m } from 'framer-motion'
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

const MotionSection = m.section
const MotionDiv = m.div
const countdownOptions = [0, 3, 5, 10]

function App() {
  const hashPreset = parseWorkoutFromHash(window.location.hash)
  const [settings, setSettings] = useState({ ...loadSettings(), ...hashPreset })
  const [showMore, setShowMore] = useState(false)

  const labels = useMemo(() => getTranslation(settings.language), [settings.language])
  const timer = useTimer(settings, labels)
  useWakeLock(timer.isRunning)

  useEffect(() => {
    saveSettings(settings)
    window.history.replaceState(null, '', createShareHash(settings))
  }, [settings])

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
    ['vibration', labels.vibration],
    ['gymMode', labels.gymMode],
  ]

  return (
    <main className="min-h-screen bg-app text-white">
      <div className="mx-auto flex min-h-screen w-full max-w-md flex-col gap-3 px-4 pb-4 pt-4">
        <header className="space-y-1">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-white/45">Fitness Interval Timer</p>
          <h1 className="text-xl font-bold tracking-tight text-white">{labels.title}</h1>
          <p className="text-xs text-white/55">{labels.subtitle}</p>
        </header>

        <AnimatePresence>
          {!timer.isRunning && (
            <MotionDiv initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} className="space-y-3">
              <PresetButtons selected={settings.preset} onSelect={onPreset} title={labels.presets} />

              <MotionSection className="glass-card space-y-3 p-4" layout>
                <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-white/45">{labels.quickConfig}</p>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { key: 'work', label: labels.workSeconds, min: 1, max: 600 },
                    { key: 'rest', label: labels.restSeconds, min: 0, max: 600 },
                    { key: 'rounds', label: labels.rounds, min: 1, max: 100 },
                  ].map((item) => (
                    <label key={item.key} className="space-y-2">
                      <span className="block text-[10px] font-semibold uppercase tracking-[0.2em] text-white/45">{item.label}</span>
                      <input
                        type="number"
                        className="h-12 w-full rounded-2xl border border-white/10 bg-black/20 px-3 text-center text-2xl font-extrabold text-white outline-none focus:border-white/35"
                        value={settings[item.key]}
                        onChange={setNum(item.key, item.min, item.max)}
                      />
                    </label>
                  ))}
                </div>
              </MotionSection>

              <MotionSection className="glass-card space-y-3 p-4" layout>
                <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-white/45">{labels.countdown}</p>
                <div className="relative grid grid-cols-4 rounded-2xl border border-white/10 bg-black/20 p-1">
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
                      className="relative z-10 rounded-xl py-2 text-sm font-bold text-white/85"
                    >
                      {c === 0 ? 'OFF' : `${c}s`}
                    </button>
                  ))}
                </div>
              </MotionSection>

              <MotionSection className="glass-card space-y-3 p-4" layout>
                <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-white/45">{labels.options}</p>
                <div className="flex flex-wrap gap-2">
                  {toggleChips.map(([key, label]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setSettings((prev) => ({ ...prev, [key]: !prev[key] }))}
                      className={`rounded-full border px-3 py-2 text-xs font-semibold ${
                        settings[key] ? 'border-white/30 bg-white/20 text-white' : 'border-white/10 bg-white/5 text-white/65'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => setShowMore((prev) => !prev)}
                  className="text-xs font-semibold uppercase tracking-[0.2em] text-white/55"
                >
                  {labels.more}
                </button>

                <AnimatePresence>
                  {showMore && (
                    <MotionDiv
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-3 overflow-hidden border-t border-white/10 pt-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-white/60">{labels.theme}</span>
                        <button
                          type="button"
                          onClick={() => setSettings((prev) => ({ ...prev, darkMode: !prev.darkMode }))}
                          className="rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-semibold"
                        >
                          {settings.darkMode ? labels.darkMode : labels.lightMode}
                        </button>
                      </div>
                      <div className="space-y-2">
                        <span className="text-xs text-white/60">{labels.language}</span>
                        <div className="flex gap-2">
                          {SUPPORTED_LANGUAGES.map((language) => (
                            <button
                              key={language}
                              type="button"
                              onClick={() => setSettings((prev) => ({ ...prev, language }))}
                              className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${
                                settings.language === language ? 'border-white/30 bg-white/20' : 'border-white/10 bg-white/5 text-white/65'
                              }`}
                            >
                              {getTranslation(language).languageName}
                            </button>
                          ))}
                        </div>
                      </div>
                    </MotionDiv>
                  )}
                </AnimatePresence>
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

                <div className="flex-1 grid place-items-center">
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

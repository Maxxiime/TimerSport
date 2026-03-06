import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
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

const countdownOptions = [0, 3, 5, 10]

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
    document.body.style.background = settings.darkMode ? '#0f0f0f' : '#fafafa'
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

  const appClass = useMemo(() => {
    return settings.darkMode ? 'min-h-screen bg-gymbg text-white px-3 py-4' : 'min-h-screen bg-zinc-50 text-zinc-900 px-3 py-4'
  }, [settings.darkMode])

  return (
    <main className={appClass}>
      <AnimatePresence mode="wait">
        {timer.activeView === 'config' ? (
          <div key="config" className="mx-auto flex min-h-screen w-full max-w-md flex-col gap-4 pb-4">
            <header className="space-y-1 pt-1">
              <h1 className="text-2xl font-black tracking-tight">{labels.title}</h1>
              <p className={`text-sm ${settings.darkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>{labels.subtitle}</p>
            </header>

            <PresetButtons selected={settings.preset} onSelect={onPreset} title={labels.presets} darkMode={settings.darkMode} />

            <section className={`grid grid-cols-1 gap-2 rounded-2xl border p-3 ${settings.darkMode ? 'border-zinc-800' : 'border-zinc-300 bg-white'}`}>
              {[
                { key: 'work', label: labels.workSeconds, min: 1, max: 600 },
                { key: 'rest', label: labels.restSeconds, min: 0, max: 600 },
                { key: 'rounds', label: labels.rounds, min: 1, max: 100 },
              ].map((item) => (
                <label key={item.key} className={`space-y-1.5 text-xs font-semibold uppercase tracking-wide ${settings.darkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>
                  {item.label}
                  <input
                    type="number"
                    className={`h-12 w-full rounded-xl border px-4 text-xl font-black ${settings.darkMode ? 'border-zinc-700 bg-zinc-900 text-white' : 'border-zinc-300 bg-white text-zinc-900'}`}
                    value={settings[item.key]}
                    onChange={setNum(item.key, item.min, item.max)}
                  />
                </label>
              ))}
            </section>

            <section className={`space-y-2 rounded-2xl border p-3 ${settings.darkMode ? 'border-zinc-800' : 'border-zinc-300 bg-white'}`}>
              <p className={`text-xs font-semibold uppercase tracking-[0.2em] ${settings.darkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>{labels.countdown}</p>
              <div className="grid grid-cols-4 gap-2">
                {countdownOptions.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setSettings((prev) => ({ ...prev, countdown: c }))}
                    className={`min-h-11 rounded-xl px-2 text-sm font-black ${
                      settings.countdown === c
                        ? settings.darkMode
                          ? 'bg-white text-black'
                          : 'bg-zinc-900 text-white'
                        : settings.darkMode
                          ? 'bg-zinc-800 text-white'
                          : 'bg-zinc-100 text-zinc-800'
                    }`}
                  >
                    {c === 0 ? 'OFF' : `${c}s`}
                  </button>
                ))}
              </div>
            </section>

            <section className={`space-y-2 rounded-2xl border p-3 ${settings.darkMode ? 'border-zinc-800' : 'border-zinc-300 bg-white'}`}>
              <p className={`text-xs font-semibold uppercase tracking-[0.2em] ${settings.darkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>{labels.options}</p>
              <div className="grid grid-cols-2 gap-2">
                {[
                  ['voice', labels.voiceCues],
                  ['beep', labels.beepSounds],
                  ['vibration', labels.vibration],
                ].map(([key, label]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setSettings((prev) => ({ ...prev, [key]: !prev[key] }))}
                    className={`min-h-11 rounded-xl border px-3 text-sm font-bold ${
                      settings[key]
                        ? 'border-work bg-work/20 text-white'
                        : settings.darkMode
                          ? 'border-zinc-700 text-zinc-300'
                          : 'border-zinc-300 text-zinc-700'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>

              <div className="space-y-2 pt-2">
                <p className={`text-xs font-semibold uppercase tracking-[0.2em] ${settings.darkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>{labels.theme}</p>
                <button
                  type="button"
                  onClick={() => setSettings((prev) => ({ ...prev, darkMode: !prev.darkMode }))}
                  className={`min-h-11 w-full rounded-xl border px-3 text-sm font-bold ${
                    settings.darkMode ? 'border-zinc-700 text-zinc-300' : 'border-zinc-300 text-zinc-700'
                  }`}
                >
                  {settings.darkMode ? labels.darkMode : labels.lightMode}
                </button>
              </div>

              <div className="space-y-2 pt-2">
                <p className={`text-xs font-semibold uppercase tracking-[0.2em] ${settings.darkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>{labels.language}</p>
                <div className="grid grid-cols-3 gap-2">
                  {SUPPORTED_LANGUAGES.map((language) => {
                    const languageLabel = getTranslation(language).languageName
                    return (
                      <button
                        key={language}
                        type="button"
                        onClick={() => setSettings((prev) => ({ ...prev, language }))}
                        className={`min-h-11 rounded-xl border px-3 text-sm font-bold ${
                          settings.language === language
                            ? settings.darkMode
                              ? 'border-white bg-white text-black'
                              : 'border-zinc-900 bg-zinc-900 text-white'
                            : settings.darkMode
                              ? 'border-zinc-700 text-zinc-300'
                              : 'border-zinc-300 text-zinc-700'
                        }`}
                      >
                        {languageLabel}
                      </button>
                    )
                  })}
                </div>
              </div>
            </section>

            <section className={`flex-1 rounded-2xl border p-2 ${settings.darkMode ? 'border-zinc-800' : 'border-zinc-300 bg-white'}`}>
              <TimerDisplay
                phase="work"
                remaining={settings.work}
                round={1}
                rounds={settings.rounds}
                phaseDuration={settings.work}
                fullscreen={false}
                labels={labels}
                darkMode={settings.darkMode}
              />
            </section>

            <TimerControls
              isRunning={timer.isRunning}
              isPaused={timer.isPaused}
              onStart={timer.start}
              onPause={timer.pause}
              onResume={timer.resume}
              onReset={timer.reset}
              labels={labels}
              darkMode={settings.darkMode}
            />
          </div>
        ) : (
          <div key="timer" className="mx-auto flex min-h-screen w-full max-w-md flex-col">
            <div className="flex-1">
              {isCountdown ? (
                <div className="grid h-full place-items-center">
                  <CountdownAnimation value={timer.remaining} />
                </div>
              ) : (
                <TimerDisplay
                  phase={timer.phase}
                  remaining={timer.remaining}
                  round={timer.round}
                  rounds={settings.rounds}
                  phaseDuration={timer.phaseDuration}
                  fullscreen
                  labels={labels}
                  darkMode={settings.darkMode}
                />
              )}
            </div>

            <div className="pb-3 pt-2">
              <TimerControls
                isRunning={timer.isRunning}
                isPaused={timer.isPaused}
                onStart={timer.start}
                onPause={timer.pause}
                onResume={timer.resume}
                onReset={timer.reset}
                labels={labels}
                darkMode={settings.darkMode}
              />
            </div>
          </div>
        )}
      </AnimatePresence>
    </main>
  )
}

export default App

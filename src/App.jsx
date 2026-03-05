import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { CountdownAnimation } from './components/CountdownAnimation'
import { PresetButtons } from './components/PresetButtons'
import { TimerControls } from './components/TimerControls'
import { TimerDisplay } from './components/TimerDisplay'
import { useTimer } from './hooks/useTimer'
import { useWakeLock } from './hooks/useWakeLock'
import { loadSettings, saveSettings } from './lib/storage'
import { PRESETS } from './lib/timerLogic'
import { createShareHash, parseWorkoutFromHash } from './lib/workoutParser'

const countdownOptions = [0, 3, 5, 10]

function App() {
  const hashPreset = parseWorkoutFromHash(window.location.hash)
  const [settings, setSettings] = useState({ ...loadSettings(), ...hashPreset })

  const timer = useTimer(settings)
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

  const wrapperClass = useMemo(() => {
    if (!timer.isRunning) return 'mx-auto max-w-3xl p-4 sm:p-8'
    if (settings.gymMode) return 'min-h-screen px-2 py-6'
    return 'min-h-screen p-4 sm:p-8'
  }, [settings.gymMode, timer.isRunning])

  return (
    <main className="min-h-screen bg-gymbg text-white">
      <div className={wrapperClass}>
        <AnimatePresence mode="wait">
          {timer.activeView === 'config' ? (
            <div key="config" className="space-y-6">
              <h1 className="text-3xl font-black sm:text-4xl">TimerSport</h1>
              <PresetButtons selected={settings.preset} onSelect={onPreset} />

              <section className="grid gap-3 rounded-2xl border border-zinc-800 p-4 sm:grid-cols-3">
                {[
                  { key: 'work', label: 'Work (s)', min: 1, max: 600 },
                  { key: 'rest', label: 'Rest (s)', min: 0, max: 600 },
                  { key: 'rounds', label: 'Rounds', min: 1, max: 100 },
                ].map((item) => (
                  <label key={item.key} className="space-y-2 text-sm font-medium text-zinc-300">
                    {item.label}
                    <input
                      type="number"
                      className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-2xl font-bold text-white"
                      value={settings[item.key]}
                      onChange={setNum(item.key, item.min, item.max)}
                    />
                  </label>
                ))}
              </section>

              <section className="space-y-3 rounded-2xl border border-zinc-800 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400">Countdown</p>
                <div className="grid grid-cols-4 gap-2">
                  {countdownOptions.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setSettings((prev) => ({ ...prev, countdown: c }))}
                      className={`rounded-xl px-2 py-3 text-sm font-bold ${settings.countdown === c ? 'bg-white text-black' : 'bg-zinc-800 text-white'}`}
                    >
                      {c === 0 ? 'OFF' : `${c}s`}
                    </button>
                  ))}
                </div>
              </section>

              <section className="space-y-3 rounded-2xl border border-zinc-800 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400">Options</p>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {[
                    ['voice', 'Voice cues'],
                    ['beep', 'Beep sounds'],
                    ['vibration', 'Vibration'],
                    ['gymMode', 'Gym mode'],
                  ].map(([key, label]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setSettings((prev) => ({ ...prev, [key]: !prev[key] }))}
                      className={`rounded-xl border px-3 py-3 text-sm font-bold ${settings[key] ? 'border-work bg-work/20' : 'border-zinc-700'}`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </section>

              <div className="rounded-2xl border border-zinc-800 p-4">
                <TimerDisplay phase="work" remaining={settings.work} round={1} rounds={settings.rounds} phaseDuration={settings.work} gymMode={settings.gymMode} rest={settings.rest} />
              </div>

              <TimerControls isRunning={timer.isRunning} isPaused={timer.isPaused} onStart={timer.start} onPause={timer.pause} onResume={timer.resume} onReset={timer.reset} />
            </div>
          ) : (
            <div key="timer" className="flex min-h-screen flex-col justify-between">
              <div className="grid flex-1 place-items-center">
                {isCountdown ? (
                  <CountdownAnimation value={timer.remaining} />
                ) : (
                  <TimerDisplay phase={timer.phase} remaining={timer.remaining} round={timer.round} rounds={settings.rounds} phaseDuration={timer.phaseDuration} gymMode={settings.gymMode} rest={settings.rest} />
                )}
              </div>

              <div className="mx-auto w-full max-w-xl pb-6">
                <TimerControls isRunning={timer.isRunning} isPaused={timer.isPaused} onStart={timer.start} onPause={timer.pause} onResume={timer.resume} onReset={timer.reset} />
              </div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </main>
  )
}

export default App

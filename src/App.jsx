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

  const appClass = useMemo(() => {
    if (timer.activeView === 'timer') {
      return settings.gymMode ? 'min-h-screen bg-black text-white px-3 py-4' : 'min-h-screen bg-gymbg text-white px-3 py-4'
    }
    return 'min-h-screen bg-gymbg text-white px-3 py-4'
  }, [settings.gymMode, timer.activeView])

  return (
    <main className={appClass}>
      <AnimatePresence mode="wait">
        {timer.activeView === 'config' ? (
          <div key="config" className="mx-auto flex min-h-screen w-full max-w-md flex-col gap-4 pb-4">
            <header className="space-y-1 pt-1">
              <h1 className="text-2xl font-black tracking-tight">TimerSport</h1>
              <p className="text-sm text-zinc-400">Mobile CrossFit interval timer</p>
            </header>

            <PresetButtons selected={settings.preset} onSelect={onPreset} />

            <section className="grid grid-cols-1 gap-2 rounded-2xl border border-zinc-800 p-3">
              {[
                { key: 'work', label: 'WORK seconds', min: 1, max: 600 },
                { key: 'rest', label: 'REST seconds', min: 0, max: 600 },
                { key: 'rounds', label: 'ROUNDS', min: 1, max: 100 },
              ].map((item) => (
                <label key={item.key} className="space-y-1.5 text-xs font-semibold uppercase tracking-wide text-zinc-400">
                  {item.label}
                  <input
                    type="number"
                    className="h-12 w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 text-xl font-black text-white"
                    value={settings[item.key]}
                    onChange={setNum(item.key, item.min, item.max)}
                  />
                </label>
              ))}
            </section>

            <section className="space-y-2 rounded-2xl border border-zinc-800 p-3">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400">Countdown</p>
              <div className="grid grid-cols-4 gap-2">
                {countdownOptions.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setSettings((prev) => ({ ...prev, countdown: c }))}
                    className={`min-h-11 rounded-xl px-2 text-sm font-black ${settings.countdown === c ? 'bg-white text-black' : 'bg-zinc-800 text-white'}`}
                  >
                    {c === 0 ? 'OFF' : `${c}s`}
                  </button>
                ))}
              </div>
            </section>

            <section className="space-y-2 rounded-2xl border border-zinc-800 p-3">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400">Options</p>
              <div className="grid grid-cols-2 gap-2">
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
                    className={`min-h-11 rounded-xl border px-3 text-sm font-bold ${settings[key] ? 'border-work bg-work/20 text-white' : 'border-zinc-700 text-zinc-300'}`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </section>

            <section className="flex-1 rounded-2xl border border-zinc-800 p-2">
              <TimerDisplay phase="work" remaining={settings.work} round={1} rounds={settings.rounds} phaseDuration={settings.work} gymMode={settings.gymMode} rest={settings.rest} fullscreen={false} />
            </section>

            <TimerControls isRunning={timer.isRunning} isPaused={timer.isPaused} onStart={timer.start} onPause={timer.pause} onResume={timer.resume} onReset={timer.reset} />
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
                  gymMode={settings.gymMode}
                  rest={settings.rest}
                  fullscreen
                />
              )}
            </div>

            <div className="pb-3 pt-2">
              <TimerControls isRunning={timer.isRunning} isPaused={timer.isPaused} onStart={timer.start} onPause={timer.pause} onResume={timer.resume} onReset={timer.reset} />
            </div>
          </div>
        )}
      </AnimatePresence>
    </main>
  )
}

export default App

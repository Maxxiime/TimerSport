import { useEffect, useRef } from 'react'

export function useWakeLock(active) {
  const lockRef = useRef(null)

  useEffect(() => {
    const requestWakeLock = async () => {
      if (!active || !('wakeLock' in navigator)) return
      try {
        lockRef.current = await navigator.wakeLock.request('screen')
      } catch {
        lockRef.current = null
      }
    }

    requestWakeLock()

    return () => {
      lockRef.current?.release?.()
      lockRef.current = null
    }
  }, [active])
}

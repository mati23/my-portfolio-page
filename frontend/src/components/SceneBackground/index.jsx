import { useEffect, useRef, useState } from "react"

export default function SceneBackground({ className, fallbackClassName }) {
  const container = useRef(null)
  const [ready, setReady] = useState(false)
  useEffect(() => {
    const landscape = window.matchMedia("(min-width: 768px) and (orientation: landscape)")
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)")
    let disposed = false
    let scene
    let generation = 0
    const update = async () => {
      const current = ++generation
      scene?.dispose()
      scene = null
      setReady(false)
      if (!landscape.matches || motion.matches) return
      // Detect WebGL without constructing a renderer or downloading Three.js.
      const canvas = document.createElement("canvas")
      const context = canvas.getContext("webgl2") || canvas.getContext("webgl")
      if (!context) return
      context.getExtension("WEBGL_lose_context")?.loseContext()
      try {
        const { default: start } = await import("../../utils/initiateThreeJS")
        if (disposed || current !== generation) return
        scene = start(container.current, () => setReady(false))
        setReady(true)
      } catch {
        // Static artwork remains available when WebGL or a lazy chunk fails.
        if (!disposed && current === generation) setReady(false)
      }
    }
    update()
    landscape.addEventListener("change", update)
    motion.addEventListener("change", update)
    return () => {
      disposed = true
      generation++
      landscape.removeEventListener("change", update)
      motion.removeEventListener("change", update)
      scene?.dispose()
    }
  }, [])
  return <>
    <div className={className} ref={container} aria-hidden="true" />
    {!ready && <div className={fallbackClassName} aria-hidden="true">
      <img src="/ps2-screen.webp" width="1280" height="720" alt="" decoding="async" />
    </div>}
  </>
}

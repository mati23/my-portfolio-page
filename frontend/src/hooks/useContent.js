import { useCallback, useEffect, useState } from "react"
import { acquireResource } from "../content/resources"

export function useContent(key) {
  const [attempt, setAttempt] = useState(0)
  const [result, setResult] = useState({ key, status: "loading" })
  useEffect(() => {
    let active = true
    const resource = acquireResource(key)
    setResult({ key, status: "loading" })
    resource.promise.then(data => {
      if (active) setResult({ key, status: "success", data })
    }, error => {
      if (active) setResult({ key, status: "error", error })
    })
    return () => { active = false; resource.release() }
  }, [key, attempt])
  const retry = useCallback(() => setAttempt(value => value + 1), [])
  return { ...(result.key === key ? result : { status: "loading" }), retry }
}

import { fetchContent } from "./catalog.js"

// Only catalog keys can enter this cache, so successful entries are bounded.
const resources = new Map()
export function acquireResource(key) {
  let entry = resources.get(key)
  if (!entry) {
    const controller = new AbortController()
    entry = { controller, consumers: 0, settled: false, timer: null }
    entry.promise = fetchContent(key, controller.signal).then(data => {
      entry.settled = true
      return data
    }, error => {
      entry.settled = true
      if (resources.get(key) === entry) resources.delete(key)
      throw error
    })
    resources.set(key, entry)
  }
  clearTimeout(entry.timer)
  entry.consumers++
  let released = false
  return {
    promise: entry.promise,
    release() {
      if (released) return
      released = true
      entry.consumers--
      // React StrictMode may immediately subscribe again after its cleanup probe.
      entry.timer = setTimeout(() => {
        if (!entry.consumers && !entry.settled) {
          if (resources.get(key) === entry) resources.delete(key)
          entry.controller.abort()
        }
      }, 0)
    },
  }
}

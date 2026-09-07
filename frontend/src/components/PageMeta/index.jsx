import { useEffect } from "react"
import { useLocation } from "react-router-dom"
export default function PageMeta({ title, description, noIndex = false }) {
  const { pathname } = useLocation()
  useEffect(() => {
    const name = title === "Mateus Arruda" ? title : `${title} | Mateus Arruda`
    const canonicalPath = pathname.replace(/\/+$/, "") || "/"
    const origin = import.meta.env.VITE_SITE_URL || window.location.origin
    document.title = name
    const tags = [
      ["name", "description", description], ["name", "robots", noIndex ? "noindex, follow" : "index, follow"],
      ["property", "og:title", name], ["property", "og:description", description],
      ["property", "og:type", "website"], ["property", "og:url", new URL(canonicalPath, origin).href],
      ["property", "og:image", new URL("/social-card.png", origin).href],
      ["name", "twitter:card", "summary_large_image"], ["name", "twitter:title", name],
      ["name", "twitter:description", description], ["name", "twitter:image", new URL("/social-card.png", origin).href],
    ]
    for (const [attribute, key, value] of tags) {
      let tag = document.head.querySelector(`meta[${attribute}="${key}"]`)
      if (!tag) { tag = document.createElement("meta"); tag.setAttribute(attribute, key); document.head.append(tag) }
      tag.content = value
    }
    let canonical = document.head.querySelector('link[rel="canonical"]')
    if (!canonical) { canonical = document.createElement("link"); canonical.rel = "canonical"; document.head.append(canonical) }
    canonical.href = new URL(canonicalPath, origin).href
  }, [title, description, noIndex, pathname])
  return null
}

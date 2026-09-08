export const BOOK_SLUGS = Object.freeze([
  "o-livro-da-economia", "make-it-stick", "o-mundo-assombrado-por-demonios", "habitos-atomicos",
])
export const YEARS = Object.freeze(["2019", "2020", "2021"])
export const CATEGORIES = Object.freeze(["game", "movie", "song", "album", "book"])
export const isBookSlug = slug => BOOK_SLUGS.includes(slug)

export class ContentError extends Error {
  constructor(message, status = 0) { super(message); this.status = status }
}
const text = value => typeof value === "string" && value.trim().length > 0
export function validateBook(value) {
  if (!value || !text(value.bookName) || !text(value.bookPublisher) ||
      !Array.isArray(value.bookAuthors) || !value.bookAuthors.length || !value.bookAuthors.every(text)) {
    throw new ContentError("The book information is invalid.")
  }
  return value
}
export function validateYear(value) {
  if (!value || CATEGORIES.some(category => {
    const item = value[category]
    return !item || !text(item.title) || typeof item.subtitle !== "string" || !text(item.description) || !/^#[0-9a-f]{6}$/i.test(item.color ?? "")
  })) throw new ContentError("The favorites information is invalid.")
  return value
}
export function describeResource(key) {
  const [kind, id] = key.split(":")
  if ((kind === "book" || kind === "review") && isBookSlug(id)) {
    return { url: `/resources/books/${id}/${kind === "book" ? "review.json" : "description.md"}`,
      validate: kind === "book" ? validateBook : value => {
        if (!text(value) || /^\s*<!doctype html/i.test(value)) throw new ContentError("The review is unavailable.")
        return value
      }, json: kind === "book" }
  }
  if (kind === "year" && YEARS.includes(id)) {
    return { url: `/resources/backgrounds/${id}/descriptions.json`, validate: validateYear, json: true }
  }
  throw new ContentError("Content not found.", 404)
}
export async function fetchContent(key, signal) {
  const resource = describeResource(key)
  const response = await fetch(resource.url, { signal })
  if (!response.ok) throw new ContentError("Could not load this content.", response.status)
  return resource.validate(await (resource.json ? response.json() : response.text()))
}

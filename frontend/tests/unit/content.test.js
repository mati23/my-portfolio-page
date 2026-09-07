import { test } from "node:test"
import assert from "node:assert/strict"
import { describeResource, validateBook, validateYear, CATEGORIES, fetchContent } from "../../src/content/catalog.js"
import { acquireResource } from "../../src/content/resources.js"

const book = { bookName: "Example", bookPublisher: "Publisher", bookAuthors: ["Author"] }
test("rejects unsupported slugs and incomplete content contracts", () => {
  for (const key of ["book:../private", "review:missing", "year:2026", "unknown:2019"]) assert.throws(() => describeResource(key))
  assert.throws(() => validateBook({ ...book, bookAuthors: [] }))
  assert.throws(() => validateBook({ ...book, bookName: 42 }))
  assert.throws(() => validateYear({ game: {} }))
  assert.equal(validateBook(book), book)
  const year = Object.fromEntries(CATEGORIES.map(key => [key, { title: key, subtitle: "", description: "Description" }]))
  assert.equal(validateYear(year), year)
})
test("rejects HTTP failures and HTML pretending to be Markdown", async t => {
  t.mock.method(globalThis, "fetch", async () => new Response("missing", { status: 404 }))
  await assert.rejects(fetchContent("review:make-it-stick"), error => error.status === 404)
  globalThis.fetch.mock.mockImplementation(async () => new Response("<!doctype html><html>fallback</html>"))
  await assert.rejects(fetchContent("review:make-it-stick"))
})
test("shares one request between consumers, tolerates StrictMode replay and caches success", async t => {
  let resolve
  let calls = 0
  t.mock.method(globalThis, "fetch", () => { calls++; return new Promise(done => { resolve = done }) })
  const first = acquireResource("book:make-it-stick")
  first.release()
  const second = acquireResource("book:make-it-stick")
  const third = acquireResource("book:make-it-stick")
  await new Promise(done => setTimeout(done, 5))
  assert.equal(calls, 1)
  resolve(Response.json(book))
  assert.deepEqual(await second.promise, book)
  assert.deepEqual(await third.promise, book)
  second.release(); third.release()
  const cached = acquireResource("book:make-it-stick")
  assert.deepEqual(await cached.promise, book)
  assert.equal(calls, 1)
  cached.release()
})
test("aborts an unused request and allows a clean retry", async t => {
  let signal
  t.mock.method(globalThis, "fetch", (_, options) => new Promise((resolve, reject) => {
    signal = options.signal
    signal.addEventListener("abort", () => reject(new DOMException("Aborted", "AbortError")))
  }))
  const abandoned = acquireResource("book:habitos-atomicos")
  const rejection = assert.rejects(abandoned.promise, error => error.name === "AbortError")
  abandoned.release()
  await rejection
  assert.equal(signal.aborted, true)
  globalThis.fetch.mock.mockImplementation(async () => Response.json(book))
  const retry = acquireResource("book:habitos-atomicos")
  assert.deepEqual(await retry.promise, book)
  retry.release()
})

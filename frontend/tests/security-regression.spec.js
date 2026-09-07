import { test, expect } from "@playwright/test"
import { readFileSync, readdirSync } from "node:fs"

const favorites = JSON.parse(readFileSync(new URL("./fixtures/favorites.json", import.meta.url)))
const booksRoot = new URL("../public/resources/books/", import.meta.url)
const books = readdirSync(booksRoot).map(slug => ({
  slug,
  ...JSON.parse(readFileSync(new URL(`${slug}/review.json`, booksRoot))),
}))

test.beforeEach(async ({ page }) => {
  const errors = []
  page.on("pageerror", error => errors.push(error.message))
  page.on("console", message => {
    if (message.type() === "error") errors.push(message.text())
  })
  await page.addInitScript(() => {
    window.securityViolations = []
    document.addEventListener("securitypolicyviolation", event => {
      window.securityViolations.push(event.violatedDirective)
    })
  })
  page.testErrors = errors
})

test.afterEach(async ({ page }) => {
  expect(page.testErrors).toEqual([])
  expect(await page.evaluate(() => window.securityViolations || [])).toEqual([])
})

test("home retains navigation, desktop WebGL and mobile fallback", async ({ page }, info) => {
  await page.goto("/", { waitUntil: "networkidle" })
  await expect(page.getByText("Mateus Arruda", { exact: true })).toBeVisible()
  if (info.project.name === "mobile") {
    await expect(page.locator('img[src="./ps2-screen.png"]')).toBeVisible()
  } else {
    await expect(page.locator("canvas")).toHaveCount(1)
    expect(await page.locator("canvas").evaluate(canvas => canvas.width)).toBeGreaterThan(1)
  }
  await page.getByRole("link", { name: "Book Reviews", exact: true }).click()
  await expect(page).toHaveURL(/\/bookreviews$/)
  await expect(page.getByRole("link", { name: "Make it Stick", exact: true })).toBeVisible()
})

test("all favorite years retain original text and extracted colors", async ({ page }) => {
  await page.goto("/myfavourites")
  for (const [year, expected] of Object.entries(favorites)) {
    await page.getByRole("button", { name: year, exact: true }).click()
    await expect.poll(async () => {
      const actual = await page.locator('[id="game"],[id="movie"],[id="song"],[id="album"],[id="book"]').evaluateAll(elements =>
      elements.filter(element => element.getBoundingClientRect().height > 0).map(element => ({
        id: element.id, color: getComputedStyle(element).backgroundColor, text: element.innerText,
      }))
      )
      // Canvas JPEG decoding can differ by a channel or two across GPU/browser paths.
      // Compare the original palette within that tolerance, with exact text and alpha.
      return actual.length === expected.length && actual.every((value, index) => {
        const original = expected[index]
        const channels = value.color.match(/[\d.]+/g)?.map(Number) || []
        const baseline = original.color.match(/[\d.]+/g).map(Number)
        return value.id === original.id && value.text === original.text &&
          channels.length === baseline.length && channels.every((channel, i) =>
            Math.abs(channel - baseline[i]) <= (i === 3 ? 0 : 2))
      })
    }).toBe(true)
  }
})

for (const book of books) {
  test(`review ${book.slug} survives direct navigation and reload`, async ({ page }) => {
    await page.goto(`/bookreviews/${book.slug}`)
    await expect(page.getByRole("heading", { name: book.bookName, exact: true })).toBeVisible()
    await expect(page.locator("section")).not.toBeEmpty()
    await page.reload()
    await expect(page.getByRole("heading", { name: book.bookName, exact: true })).toBeVisible()
    await expect.poll(() => page.locator("img").evaluateAll(images => images.every(image => image.complete && image.naturalWidth > 0))).toBe(true)
  })
}

test("portfolio remains available", async ({ page }) => {
  await page.goto("/myportfolio")
  await expect(page.getByRole("heading", { name: "Professional Experience", exact: true })).toBeVisible()
  await expect(page.getByRole("heading", { name: "Additional Skills", exact: true })).toBeVisible()
})

test("production serves security headers and hides private files", async ({ request }) => {
  const response = await request.get("/bookreviews/make-it-stick")
  expect(response.status()).toBe(200)
  expect(response.headers()["x-content-type-options"]).toBe("nosniff")
  expect(response.headers()["content-security-policy"]).toContain("object-src 'none'")
  expect((await request.get("/.env")).status()).toBe(404)
  expect((await request.get("/.git/config")).status()).toBe(404)
  expect((await request.get("/resources/missing.json")).status()).toBe(404)
})

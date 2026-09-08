import { test, expect } from "@playwright/test"
import AxeBuilder from "@axe-core/playwright"

const visibleHeading = page => page.locator("h1").first()

test("content is shared by year and cached across navigation @lifecycle", async ({ page }) => {
  const requests = []
  page.on("request", request => { if (request.url().endsWith("descriptions.json")) requests.push(request.url()) })
  await page.goto("/myfavourites")
  await expect(page.locator("article")).toHaveCount(5)
  for (const year of ["2020", "2021", "2019"]) {
    await page.getByRole("button", { name: year, exact: true }).click()
    await expect(page.locator("article")).toHaveCount(5)
    await expect(page.locator(`h2[id^="${year}-"]`)).toHaveCount(5)
  }
  expect(requests).toHaveLength(3)
  expect(new Set(await page.locator("[id]").evaluateAll(elements => elements.map(e => e.id))).size)
    .toBe(await page.locator("[id]").count())
})

test("same-route review changes discard stale responses @lifecycle", async ({ page }) => {
  let aborted = false
  await page.route("**/books/o-livro-da-economia/description.md", async route => {
    await new Promise(done => setTimeout(done, 800))
    try { await route.fulfill({ body: "STALE REVIEW CONTENT", contentType: "text/markdown" }) } catch { aborted = true }
  })
  await page.goto("/bookreviews/o-livro-da-economia")
  await expect(visibleHeading(page)).toHaveText("O Livro da Economia")
  await page.getByRole("link", { name: "Next review" }).click()
  await expect(visibleHeading(page)).toHaveText("Make it Stick")
  await expect(page.locator("section")).not.toBeEmpty()
  await page.waitForTimeout(900)
  await expect(page.getByText("STALE REVIEW CONTENT")).toHaveCount(0)
  expect(aborted || (await page.locator("section").innerText()).length > 100).toBe(true)
})

test("invalid JSON and network failures show retry controls", async ({ page }) => {
  let fail = true
  await page.route("**/backgrounds/2019/descriptions.json", route => fail
    ? route.fulfill({ json: { game: { title: "Incomplete" } } }) : route.continue())
  await page.goto("/myfavourites")
  await expect(page.getByRole("alert")).toContainText("Unable to load")
  fail = false
  await page.getByRole("button", { name: "Try again" }).click()
  await expect(page.locator("article")).toHaveCount(5)
})

test("a failed thumbnail and review can be retried without reloading", async ({ page }) => {
  let failBook = true
  await page.route("**/books/make-it-stick/review.json", route => failBook ? route.abort() : route.continue())
  await page.goto("/bookreviews")
  await expect(page.getByRole("alert")).toContainText("book details")
  failBook = false
  await page.getByRole("button", { name: "Try again" }).click()
  await page.getByRole("link", { name: "Make it Stick", exact: true }).click()
  await expect(visibleHeading(page)).toHaveText("Make it Stick")
})

test("menu supports keyboard, Escape and focus on navigation", async ({ page }, info) => {
  await page.goto("/bookreviews")
  if (info.project.name === "mobile") {
    const toggle = page.getByRole("button", { name: "Open main menu" })
    await toggle.focus()
    await page.keyboard.press("Enter")
    await expect(page.getByRole("button", { name: "Close main menu" })).toHaveAttribute("aria-expanded", "true")
    await page.keyboard.press("Escape")
    await expect(toggle).toBeFocused()
    await toggle.click()
  }
  await page.getByRole("navigation", { name: "Main navigation" }).getByRole("link", { name: "Portfolio", exact: true }).click()
  await expect(page.getByRole("heading", { name: "Professional Experience" })).toBeVisible()
  await expect(page.locator("#main-content")).toBeFocused()
  if (info.project.name === "mobile") await expect(page.getByRole("button", { name: "Open main menu" })).toHaveAttribute("aria-expanded", "false")
})

test("404 pages and route metadata exist before JavaScript", async ({ page, request }) => {
  const response = await request.get("/bookreviews/make-it-stick")
  expect(await response.text()).toContain("<title>Make it Stick | Mateus Arruda</title>")
  expect(await response.text()).toContain('property="og:image"')
  expect((await request.get("/missing-page")).status()).toBe(404)
  await page.goto("/missing-page")
  await expect(visibleHeading(page)).toHaveText("Page not found")
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", "noindex, follow")
  await page.goto("/bookreviews/not-a-book")
  await expect(visibleHeading(page)).toHaveText("Book not found")
  await page.getByRole("link", { name: "Browse book reviews" }).click()
  await expect(page).toHaveTitle("Book Reviews | Mateus Arruda")
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", "index, follow")
})

test("reduced motion and unavailable WebGL avoid downloading the scene @lifecycle", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" })
  const scripts = []
  page.on("request", request => { if (request.resourceType() === "script") scripts.push(request.url()) })
  await page.goto("/")
  await expect(page.locator('img[src="/ps2-screen.webp"]')).toBeVisible()
  await expect(page.locator("canvas")).toHaveCount(0)
  expect(scripts.some(url => url.includes("initiateThreeJS"))).toBe(false)
  await page.goto("about:blank")
  await page.emulateMedia({ reducedMotion: "no-preference" })
  await page.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext
    HTMLCanvasElement.prototype.getContext = function (type, ...args) {
      return type.startsWith("webgl") ? null : original.call(this, type, ...args)
    }
  })
  scripts.length = 0
  await page.goto("/")
  await expect(page.locator('img[src="/ps2-screen.webp"]')).toBeVisible()
  expect(scripts.some(url => url.includes("initiateThreeJS"))).toBe(false)
})

test("WebGL releases contexts and animation callbacks across repeated mounts @lifecycle", async ({ page }) => {
  // Exercise the real scene at a smaller landscape size on software-rendered CI.
  await page.setViewportSize({ width: 800, height: 450 })
  await page.addInitScript(() => {
    const contexts = new Set(), frames = new Set()
    const getContext = HTMLCanvasElement.prototype.getContext
    HTMLCanvasElement.prototype.getContext = function (type, ...args) {
      const context = getContext.call(this, type, ...args)
      if (context && type.startsWith("webgl") && !contexts.has(context)) {
        contexts.add(context)
        const extension = context.getExtension("WEBGL_lose_context")
        if (extension && !extension.instrumented) {
          const lose = extension.loseContext.bind(extension)
          extension.loseContext = () => { contexts.delete(context); lose() }
          extension.instrumented = true
        }
      }
      return context
    }
    const raf = window.requestAnimationFrame.bind(window), cancel = window.cancelAnimationFrame.bind(window)
    window.requestAnimationFrame = callback => {
      const id = raf(time => { frames.delete(id); callback(time) }); frames.add(id); return id
    }
    window.cancelAnimationFrame = id => { frames.delete(id); cancel(id) }
    window.sceneStats = () => ({ contexts: contexts.size, frames: frames.size })
  })
  await page.goto("/")
  for (let cycle = 0; cycle < 3; cycle++) {
    await expect(page.locator("canvas")).toHaveCount(1)
    await expect.poll(() => page.evaluate(() => window.sceneStats())).toEqual({ contexts: 1, frames: 1 })
    await page.setViewportSize({ width: 820 + cycle * 10, height: 470 })
    await expect.poll(() => page.locator("canvas").evaluate(canvas => canvas.width)).toBeGreaterThan(1)
    expect(await page.locator("canvas").evaluate(canvas => canvas.width <= 1920 && canvas.height <= 1080)).toBe(true)
    await page.getByRole("link", { name: "Book Reviews", exact: true }).click()
    await expect(page.getByRole("link", { name: "Make it Stick", exact: true })).toBeVisible()
    await expect.poll(() => page.evaluate(() => window.sceneStats())).toEqual({ contexts: 0, frames: 0 })
    // On the mobile project the viewport has been made wide enough for the desktop menu.
    await page.getByRole("navigation", { name: "Main navigation" }).getByRole("link", { name: "Home", exact: true }).click()
  }
  await page.emulateMedia({ reducedMotion: "reduce" })
  await expect(page.locator("canvas")).toHaveCount(0)
  await expect.poll(() => page.evaluate(() => window.sceneStats())).toEqual({ contexts: 0, frames: 0 })
})

for (const route of ["/", "/bookreviews", "/bookreviews/make-it-stick", "/myfavourites", "/myportfolio"]) {
  test(`accessibility and responsive layout: ${route}`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" })
    await page.goto(route, { waitUntil: "networkidle" })
    await expect(page.locator("h1")).toHaveCount(1)
    const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze()
    expect(results.violations.map(v => ({ id: v.id, nodes: v.nodes.map(n => n.target) }))).toEqual([])
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true)
  })
}

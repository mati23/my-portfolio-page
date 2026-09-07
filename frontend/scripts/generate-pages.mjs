import { readFile, writeFile, mkdir } from "node:fs/promises"
import { loadEnv } from "vite"
import { BOOK_SLUGS, validateBook, YEARS, validateYear } from "../src/content/catalog.js"
const env = loadEnv("production", process.cwd(), "VITE_")
const site = env.VITE_SITE_URL?.trim()
if (site && (!/^https?:\/\//.test(site) || new URL(site).pathname !== "/")) {
  throw new Error("VITE_SITE_URL must be an HTTP(S) origin without a path.")
}
const escape = value => value.replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("<", "&lt;").replaceAll(">", "&gt;")
const template = await readFile("dist/index.html", "utf8")
const pages = [
  ["", "Mateus Arruda", "Mateus Arruda — software engineer. Explore my portfolio, book reviews and favorites."],
  ["myportfolio", "Portfolio", "Mateus Arruda — software engineering experience, education and technical skills."],
  ["myfavourites", "Favorites", "Favorite games, movies, songs, albums and books by year — Mateus Arruda."],
  ["bookreviews", "Book Reviews", "Reading notes and book reviews by Mateus Arruda."],
]
for (const slug of BOOK_SLUGS) {
  const book = validateBook(JSON.parse(await readFile(`public/resources/books/${slug}/review.json`, "utf8")))
  pages.push([`bookreviews/${slug}`, book.bookName, `Read Mateus Arruda's review of ${book.bookName}, by ${book.bookAuthors.join(", ")}.`])
}
for (const year of YEARS) validateYear(JSON.parse(await readFile(`public/resources/backgrounds/${year}/descriptions.json`, "utf8")))
for (const [path, title, description] of [...pages, ["404.html", "Page not found", "The requested page is unavailable."]]) {
  const name = title === "Mateus Arruda" ? title : `${title} | Mateus Arruda`
  const noIndex = path === "404.html"
  const image = site ? new URL("/social-card.png", site).href : "/social-card.png"
  const tags = `<meta name="robots" content="${noIndex ? "noindex, follow" : "index, follow"}">
<meta property="og:title" content="${escape(name)}"><meta property="og:description" content="${escape(description)}">
<meta property="og:type" content="website"><meta property="og:image" content="${escape(image)}">
<meta name="twitter:card" content="summary_large_image"><meta name="twitter:image" content="${escape(image)}">
${site && !noIndex ? `<link rel="canonical" href="${escape(new URL(`/${path}`, site).href)}"><meta property="og:url" content="${escape(new URL(`/${path}`, site).href)}">` : ""}`
  const html = template.replace(/<title>.*?<\/title>/, `<title>${escape(name)}</title>`)
    .replace(/<meta name="description"[^>]*>/, `<meta name="description" content="${escape(description)}">`)
    .replace("</head>", `${tags}\n</head>`)
  const file = noIndex ? "dist/404.html" : `dist/${path ? path + "/" : ""}index.html`
  if (path && !noIndex) await mkdir(`dist/${path}`, { recursive: true })
  await writeFile(file, html)
}
if (site) await writeFile("dist/sitemap.xml", `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${pages.map(([path]) => `<url><loc>${escape(new URL(`/${path}`, site).href)}</loc></url>`).join("")}</urlset>`)
await writeFile("dist/robots.txt", `User-agent: *\nAllow: /\n${site ? `Sitemap: ${new URL("/sitemap.xml", site).href}\n` : ""}`)
console.log(`Generated metadata for ${pages.length} pages and a 404 page${site ? " with canonical URLs" : " (public domain not configured)"}.`)

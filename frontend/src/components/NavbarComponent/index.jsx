import { useEffect, useRef, useState } from "react"
import { Link, NavLink, useLocation } from "react-router-dom"
import styles from "./styles.module.css"
const links = [["/", "Home"], ["/myfavourites", "Favorites"], ["/bookreviews", "Book Reviews"], ["/myportfolio", "Portfolio"]]
export default function NavbarComponent() {
  const [open, setOpen] = useState(false)
  const toggle = useRef(null)
  const nav = useRef(null)
  const { pathname } = useLocation()
  useEffect(() => { setOpen(false) }, [pathname])
  useEffect(() => {
    if (!open) return
    const outside = event => { if (!nav.current?.contains(event.target)) setOpen(false) }
    document.addEventListener("pointerdown", outside)
    return () => document.removeEventListener("pointerdown", outside)
  }, [open])
  return <nav className={styles.navbar} aria-label="Main navigation" ref={nav} onKeyDown={event => {
    if (event.key === "Escape" && open) { setOpen(false); toggle.current?.focus() }
  }}>
    <div className={styles.container}>
      <Link to="/"><img src="/brand.svg" width="36" height="36" alt="" />
        <span className={styles.logoName}>Mateus Arruda</span></Link>
      <button ref={toggle} type="button" className={styles.button} aria-controls="navbar-default"
        aria-expanded={open} aria-label={open ? "Close main menu" : "Open main menu"} onClick={() => setOpen(value => !value)}>
        <svg className="w-6 h-6" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d={open ? "M6 6l12 12M6 18L18 6" : "M3 6h18M3 12h18M3 18h18"} />
        </svg>
      </button>
      <div className={styles.navbarDefault} id="navbar-default" data-open={open}>
        <ul>{links.map(([to, label]) => <li key={to}><NavLink to={to} end={to === "/"}>{label}</NavLink></li>)}</ul>
      </div>
    </div>
  </nav>
}

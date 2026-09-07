import { useEffect, useRef } from "react"
import { Outlet, useLocation } from "react-router-dom"
import NavbarComponent from "../components/NavbarComponent"
export default function Root() {
  const { pathname } = useLocation()
  const previousPath = useRef(pathname)
  const main = useRef(null)
  useEffect(() => {
    if (previousPath.current !== pathname) {
      window.scrollTo(0, 0)
      main.current?.focus({ preventScroll: true })
      previousPath.current = pathname
    }
  }, [pathname])
  return <>
    <a className="skip-link" href="#main-content">Skip to content</a>
    {pathname !== "/" && <NavbarComponent />}
    <main id="main-content" ref={main} tabIndex={-1}><Outlet /></main>
  </>
}

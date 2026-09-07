import { lazy, Suspense } from "react"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import Root from "./routes/root"
import HomeComponent from "./components/HomeComponent"
import NotFoundPage from "./pages/NotFoundPage"
import PageErrorBoundary from "./components/PageErrorBoundary"
const BookReviews = lazy(() => import("./components/BookReviewsComponent"))
const BookReview = lazy(() => import("./components/BookReviewComponent"))
const Portfolio = lazy(() => import("./components/PortfolioComponent"))
const Favorites = lazy(() => import("./components/MyTopComponent"))
export default function App() {
  return <PageErrorBoundary><BrowserRouter><Suspense fallback={<p className="content-state" role="status">Loading page…</p>}>
    <Routes><Route element={<Root />}>
      <Route index element={<HomeComponent />} />
      <Route path="myfavourites" element={<Favorites />} />
      <Route path="myportfolio" element={<Portfolio />} />
      <Route path="bookreviews" element={<BookReviews />} />
      <Route path="bookreviews/:bookId" element={<BookReview />} />
      <Route path="*" element={<NotFoundPage />} />
    </Route></Routes>
  </Suspense></BrowserRouter></PageErrorBoundary>
}

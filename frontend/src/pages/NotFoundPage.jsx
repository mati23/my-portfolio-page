import { Link } from "react-router-dom"
import PageMeta from "../components/PageMeta"
export default function NotFoundPage({ book = false }) {
  return <div className="content-state">
    <PageMeta title="Page not found" description="The requested page is unavailable." noIndex />
    <h1>{book ? "Book not found" : "Page not found"}</h1>
    <p>{book ? "This book is not in the reviews catalog." : "The page you requested does not exist."}</p>
    <Link className="action-link" to={book ? "/bookreviews" : "/"}>{book ? "Browse book reviews" : "Back to home"}</Link>
  </div>
}

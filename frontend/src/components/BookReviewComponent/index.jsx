import { Link, useParams } from "react-router-dom"
import ReactMarkdown from "react-markdown"
import { BOOK_SLUGS, isBookSlug } from "../../content/catalog"
import { useContent } from "../../hooks/useContent"
import ContentState from "../ContentState"
import PageMeta from "../PageMeta"
import NotFoundPage from "../../pages/NotFoundPage"
import assets from "../../content/assets.json"
import styles from "./styles.module.css"

function Review({ slug }) {
  const book = useContent(`book:${slug}`)
  const review = useContent(`review:${slug}`)
  const size = assets[`books/${slug}/my-book`]
  const next = BOOK_SLUGS[(BOOK_SLUGS.indexOf(slug) + 1) % BOOK_SLUGS.length]
  if (book.error?.status === 404 || review.error?.status === 404) return <NotFoundPage book />
  return <article className={styles.bookReview}>
    <PageMeta title={book.data?.bookName || "Book Review"} description={book.data
      ? `Read Mateus Arruda's review of ${book.data.bookName}, by ${book.data.bookAuthors.join(", ")}.`
      : "Book reviews and reading notes by Mateus Arruda."} />
    {book.data ? <>
      <h1 className={styles.bookTitle}>{book.data.bookName}</h1>
      <img src={`/resources/books/${slug}/my-book-1600.webp`}
        srcSet={`/resources/books/${slug}/my-book-800.webp 800w, /resources/books/${slug}/my-book-1600.webp 1600w`}
        sizes="(min-width: 1440px) 1440px, 95vw" width={size.width} height={size.height}
        decoding="async" alt={`Personal copy of ${book.data.bookName}`} />
    </> : <ContentState {...book} label="book details" />}
    {review.data ? <section className={styles.bookDescription} aria-label="Book review">
      <ReactMarkdown>{review.data}</ReactMarkdown>
    </section> : <ContentState {...review} label="review" />}
    <nav className="review-navigation" aria-label="More book reviews">
      <Link to="/bookreviews">All reviews</Link><Link to={`/bookreviews/${next}`}>Next review</Link>
    </nav>
  </article>
}
export default function BookReviewComponent() {
  const { bookId } = useParams()
  return isBookSlug(bookId) ? <Review slug={bookId} /> : <NotFoundPage book />
}

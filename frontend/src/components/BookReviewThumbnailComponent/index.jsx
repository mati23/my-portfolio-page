import { Link } from "react-router-dom"
import { useContent } from "../../hooks/useContent"
import ContentState from "../ContentState"
import styles from "./styles.module.css"

export default function BookReviewThumbnailComponent({ bookFolderName }) {
  const resource = useContent(`book:${bookFolderName}`)
  const book = resource.data
  return <article className={styles.container}>
    <div>
      <div className={styles.bookPicture}>
        <img src={`/resources/books/${bookFolderName}/thumbnail.webp`} width="160" height="160"
          loading="lazy" decoding="async" alt={book ? `Cover of ${book.bookName}` : "Book cover"} />
      </div>
      {book ? <div className={styles.bookInfo}>
        <h2><Link className={styles.bookTitle} to={`/bookreviews/${bookFolderName}`}>{book.bookName}</Link></h2>
        <div className={styles.bookInfoAuthor}>{book.bookAuthors.map(author => <span key={author}>{author}</span>)}</div>
        <div className={styles.bookInfoPublisher}>{book.bookPublisher}</div>
      </div> : <ContentState {...resource} label="book details" />}
    </div>
  </article>
}

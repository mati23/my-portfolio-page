import BookReviewThumbnailComponent from "../BookReviewThumbnailComponent"
import { BOOK_SLUGS } from "../../content/catalog"
import PageMeta from "../PageMeta"
import styles from "./styles.module.css"
export default function BookReviewsComponent() {
  return <>
    <PageMeta title="Book Reviews" description="Reading notes and book reviews by Mateus Arruda." />
    <h1 className="sr-only">Book Reviews</h1>
    <div className={styles.bookGrid}>
      {BOOK_SLUGS.map(slug => <BookReviewThumbnailComponent key={slug} bookFolderName={slug} />)}
    </div>
  </>
}

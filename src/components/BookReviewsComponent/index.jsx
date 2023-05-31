import '../../resources/fonts/Bebas_Neue/BebasNeue-Regular.ttf'
import BookReviewThumbnailComponent from "../BookReviewThumbnailComponent"
import NavbarComponent from '../NavbarComponent'

import styles from "./styles.module.css"

const BookReviewsComponent = () => {
	return (
		<>
			<NavbarComponent />
			<div>
				<div className={styles.bookGrid}>
					<BookReviewThumbnailComponent bookFolderName="o-livro-da-economia" />
					<BookReviewThumbnailComponent bookFolderName="make-it-stick" />
					<BookReviewThumbnailComponent bookFolderName="o-mundo-assombrado-por-demonios" />
					<BookReviewThumbnailComponent bookFolderName="habitos-atomicos" />
				</div>
			</div>
		</>
	)
}

export default BookReviewsComponent

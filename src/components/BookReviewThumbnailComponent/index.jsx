import React, { useEffect, useState } from "react"
import '../../resources/fonts/Bebas_Neue/BebasNeue-Regular.ttf'

import styles from "./styles.module.css"
import "./styles.module.css"
import { urlFormater } from "../../utils/urlFormater"

const BookReviewThumbnailComponent = (props) => {
	const { bookFolderName } = props
	const [bookTitle, setBookTitle] = useState("Book Title")
	const [bookPublisher, setBookPublisher] = useState("Book Publisher")
	const [bookAuthors, setBookAuthors] = useState([])

	function getJsonFileForEntityAndYear() {
		const url = urlFormater(["/resources/books", bookFolderName, "review.json"])
		fetch(url)
			.then((response) => response.json())
			.then((data) => {
				console.log(data["bookName"])
				setBookTitle(data["bookName"])
				setBookPublisher(data["bookPublisher"])
				setBookAuthors(data["bookAuthors"])
			})
	}

	useEffect(() => { getJsonFileForEntityAndYear() }, [])

	return (
		<div className={styles.container}>
			<div>
				<div className={styles.bookPicture}>
					<img src={urlFormater(["/resources/books", bookFolderName, "thumbnail.jpg"])} />
				</div>
				<div className={styles.bookInfo}>
					<a className={styles.bookTitle} href={"bookreviews/" + bookFolderName}>
						{bookTitle}
					</a>

					<div className={styles.bookInfoAuthor}>
						{/* { bookAuthors.length > 1 ? "Autores" : "Autor" } : */}
						{ bookAuthors.map((author) => <span key={author}>{author}</span>) }
					</div>

					<div className={styles.bookInfoPublisher}>
						{bookPublisher}
					</div>

				</div>
			</div>
		</div>)
}

export default BookReviewThumbnailComponent

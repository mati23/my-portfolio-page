import { useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import { ReactMarkdown } from "react-markdown/lib/react-markdown"

import styles from "./styles.module.css"
import { urlFormater } from "../../utils/urlFormater"
import NavbarComponent from "../NavbarComponent"

const BookReviewComponent = () => {
	const params = useParams()
	const [bookName, setBookName] = useState("Book Name")
	const [bookDescription, setBookDescription] = useState("")

	function getJsonFileForEntityAndYear() {
		fetch(urlFormater(["/resources/books", params.bookId, "review.json"]))
			.then((r) => {
				console.log("json requested is: ", r.json)
				return r.json()
			})
			.then((data) => setBookName(data["bookName"]))
	}

	useEffect(() => {
		console.log(params)
		getJsonFileForEntityAndYear()
	})

	const getBookDescription = (bookId) => {
		const url = urlFormater(["/resources/books", bookId, "description.md"])
		return fetch(url)
			.then(response => response.text())
			.then(data => setBookDescription(data))
			.catch(error => console.log("Error: ", error))
	}

	useEffect(() => {
		getBookDescription(params.bookId)
	}, [])

	return (
		<>
			<NavbarComponent />
			<div className={styles.bookReview}>
				<h1 className={styles.bookTitle}>{bookName}</h1>
				<img src={urlFormater(["/resources/books", params.bookId, "my-book.png"])} />
				<section className={styles.bookDescription}>
					<ReactMarkdown>{bookDescription}</ReactMarkdown>
				</section>
			</div>
		</>
	)
}

export default BookReviewComponent

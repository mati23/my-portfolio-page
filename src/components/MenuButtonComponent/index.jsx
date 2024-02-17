import { useEffect, useState } from "react"

import styles from "./styles.module.css"
import "./styles.module.css"

const MenuButtonComponent = ({
	text: newText = "",
	index: newIndex = 1,
	reference: newRef
}) => {

	const [index, setIndex] = useState(1)
	const [text, setText] = useState("")
	const [ref, setRef] = useState("")

	useEffect(() => {
		setIndex(newIndex)
		setText(newText)
		setRef(newRef)
	}, [])

	return (
		<div className={styles.buttonGradient} style={{ marginLeft: index * 20 + 'px' }} >
			<a href={ref}>{text}</a>
		</div>
	)
}

export default MenuButtonComponent
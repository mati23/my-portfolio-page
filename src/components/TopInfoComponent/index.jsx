import React, { useEffect, useState } from "react"
import { ColorExtractor } from "react-color-extractor"

import IconComponent from "../IconComponent"
import { urlFormater } from "../../utils/urlFormater"

import styles from "./styles.module.css"

const TopInfoComponent = (props) => {
	const { activeYear, year, entityName } = props
	const [imgSource, setImgSource] = useState("")
	const [entityTitle, setEntityTitle] = useState("")
	const [entitySubtitle, setEntitySubtitle] = useState("")
	const [description, setDescription] = useState("")
	const [colors, setColors] = useState([])

	const containerClass = activeYear === year ? styles.activeContainer : styles.container

	const getJsonFileForEntityAndYear = () => {
		fetch(urlFormater(["/resources/backgrounds", year, "descriptions.json"]))
			.then((response) => response.json())
			.then((data) => {
				setDescription(data[entityName].description)
				setEntityTitle(data[entityName].title)
				setEntitySubtitle(data[entityName].subtitle)
			})
	}

	useEffect(() => {
		const checkOperations = [imgSource, entityTitle, entitySubtitle, description]
		if (year === activeYear && checkOperations.every(value => value === "")) {
			getJsonFileForEntityAndYear()
			setImgSource(urlFormater(["/resources/backgrounds", year, entityName + ".jpg"]))
		}
	}, [activeYear])

	return (
		<div id={entityName} className={containerClass}
			style={{ backgroundColor: colors[0] ? colors[0] + "a8" : "transparent" }}>
			<div className={styles.imageBackground}>

				<ColorExtractor getColors={colorArray => setColors(colorArray)}>
					<img src={imgSource} alt={year + " - " + entityTitle} />
				</ColorExtractor>
			</div>

			<div className={styles.info}>
				<div className={styles.titleContainer}>
					<div>
						<h1>{entityTitle}</h1>
						<div className={styles.subtitle}>{entitySubtitle}</div>
					</div>
					<IconComponent entityName={entityName} />
				</div>
				<div className={styles.description}>{description}</div>
			</div>
		</div>


	)
}

export default TopInfoComponent

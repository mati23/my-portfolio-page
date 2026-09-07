import styles from "./styles.module.css"

function ExperienceIconComponent(props) {
	const { entityName, iconOnly } = props

	return (
		<div className={styles.iconContainer}>
			<img alt={iconOnly ? entityName : ""} loading="lazy" decoding="async" width="64" height="64" src={"/resources/icons/" + entityName.toLowerCase() + ".png"} />

			{!iconOnly && <div>
				<span>{entityName.replaceAll("-", " ")}</span>
			</div>}
		</div>
	)
}

export default ExperienceIconComponent

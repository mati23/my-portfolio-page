import styles from "./styles.module.css"
import "./styles.module.css"

function ExperienceIconComponent(props) {
	const { entityName, iconOnly } = props

	return (
		<div className={styles.iconContainer}>
			<img src={"/resources/icons/" + entityName.toLowerCase() + ".png"} />

			{!iconOnly && <div>
				<span>{entityName.replaceAll("-", " ")}</span>
			</div>}
		</div>
	)
}

export default ExperienceIconComponent

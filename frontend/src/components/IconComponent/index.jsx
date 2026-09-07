import styles from "./styles.module.css"
import { urlFormater } from "../../utils/urlFormater"

function IconComponent(props) {
	const { entityName, iconOnly } = props
	const imageIcon = urlFormater(["/icons", entityName + ".png"])

	return (
		<div className={styles.onlyIcon}>
			<div className={styles.imageIcon}><img src={imageIcon} alt={iconOnly ? entityName : ""} width="32" height="32" loading="lazy" decoding="async" /></div>
			{ !iconOnly && <div className={styles.description}>{entityName}</div> }
		</div>
	)
}

export default IconComponent

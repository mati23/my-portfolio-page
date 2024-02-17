import ExperienceComponent from "../ExperienceComponent"
import NavbarComponent from "../NavbarComponent"

import styles from "./styles.module.css"
import "./styles.module.css"

const PortfolioComponent = () => {
	return (
		<>
			<NavbarComponent />
			<div className={styles.container}>
				<ExperienceComponent />
			</div>
		</>
	)
}

export default PortfolioComponent

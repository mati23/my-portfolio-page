import { useState } from "react"

import TopInfoComponent from "../TopInfoComponent"

import styles from "./styles.module.css"
import "./styles.module.css"
import NavbarComponent from "../NavbarComponent"

const MyTopComponent = () => {
	const years = ["2019", "2020", "2021"]
	const [activeYear, setActiveYear] = useState(years[0])
	const changeActiveYear = (year) => setActiveYear(year)

	return (
		<>
			<NavbarComponent />
			<div className={styles.container}>
				<div className={styles.timelineButtons}>
					<div>
						{years.map(year =>
							<button key={year} onClick={() => changeActiveYear(year)}
								className={activeYear === year ? styles.activeButton : styles.inactiveButton}>
								{year}
							</button>
						)}
					</div>
				</div>

				<div className={styles.timelineInfo}>
					{years.map((year) =>
						<div key={year}>
							<TopInfoComponent entityName={"game"} activeYear={activeYear} year={year} />
							<TopInfoComponent entityName={"movie"} activeYear={activeYear} year={year} />
							<TopInfoComponent entityName={"song"} activeYear={activeYear} year={year} />
							<TopInfoComponent entityName={"album"} activeYear={activeYear} year={year} />
							<TopInfoComponent entityName={"book"} activeYear={activeYear} year={year} />
						</div>
					)}
				</div>
			</div>
		</>
	)
}

export default MyTopComponent

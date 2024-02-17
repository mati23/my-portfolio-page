import { useEffect, useRef, useState } from "react"
import initiateThreeJS from "../../utils/initiateThreeJS"

import MenuButtonComponent from "../MenuButtonComponent"

import styles from "./styles.module.css"

const HomeComponent = () => {
	const canvas3d = useRef()
	const [onMobile, setOnMobile] = useState(false)

	useEffect(() => {
		const widthScreen = window.innerWidth
		const heightScreen = window.innerHeight
		if (widthScreen / heightScreen > 1) {
			const { renderer } = initiateThreeJS()
			canvas3d.current.replaceWith(renderer.domElement)
			return
		}

		setOnMobile(true)
	})

	return (
		<div className={styles.homeComponentContainer} id={styles.homeComponentContainer}>
			<div className={styles.welcomeMessageContainer}>Mateus Arruda</div>
			<div className={styles.menuContainer}>
				<MenuButtonComponent index={1} text={"Favorites"} reference="/myfavourites" />
				<MenuButtonComponent index={2} text={"Book Reviews"} reference="/bookreviews" />
				<MenuButtonComponent index={3} text={"Portfolio"} reference="/myportfolio" />
			</div>
			<div className={styles.canvas3d}><canvas ref={canvas3d}></canvas></div>
			{onMobile &&
				<div className={styles.ps2Screen}><img src="./ps2-screen.png" /></div>}
		</div>
	)
}

export default HomeComponent;


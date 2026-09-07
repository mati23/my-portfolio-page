import MenuButtonComponent from "../MenuButtonComponent"
import SceneBackground from "../SceneBackground"
import PageMeta from "../PageMeta"
import styles from "./styles.module.css"
export default function HomeComponent() {
  return <div className={styles.homeComponentContainer}>
    <PageMeta title="Mateus Arruda" description="Mateus Arruda — software engineer. Explore my portfolio, book reviews and favorites." />
    <h1 className={styles.welcomeMessageContainer}>Mateus Arruda</h1>
    <nav className={styles.menuContainer} aria-label="Explore the portfolio">
      <MenuButtonComponent index={1} text="Favorites" reference="/myfavourites" />
      <MenuButtonComponent index={2} text="Book Reviews" reference="/bookreviews" />
      <MenuButtonComponent index={3} text="Portfolio" reference="/myportfolio" />
    </nav>
    <SceneBackground className={styles.canvas3d} fallbackClassName={styles.ps2Screen} />
  </div>
}

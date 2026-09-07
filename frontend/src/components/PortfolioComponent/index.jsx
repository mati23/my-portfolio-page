import ExperienceComponent from "../ExperienceComponent"
import PageMeta from "../PageMeta"
import styles from "./styles.module.css"
export default function PortfolioComponent() {
  return <div className={styles.container}>
    <PageMeta title="Portfolio" description="Mateus Arruda — software engineering experience, education and technical skills." />
    <h1 className="sr-only">Portfolio</h1>
    <ExperienceComponent />
  </div>
}

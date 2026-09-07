import { useState } from "react"
import TopInfoComponent from "../TopInfoComponent"
import { YEARS, CATEGORIES } from "../../content/catalog"
import { useContent } from "../../hooks/useContent"
import ContentState from "../ContentState"
import PageMeta from "../PageMeta"
import styles from "./styles.module.css"
export default function MyTopComponent() {
  const [year, setYear] = useState(YEARS[0])
  const resource = useContent(`year:${year}`)
  return <div className={styles.container}>
    <PageMeta title="Favorites" description="Favorite games, movies, songs, albums and books by year — Mateus Arruda." />
    <h1 className="sr-only">Favorites</h1>
    <div className={styles.timelineButtons}><div role="group" aria-label="Choose a year">
      {YEARS.map(value => <button key={value} type="button" aria-pressed={year === value}
        onClick={() => setYear(value)} className={year === value ? styles.activeButton : styles.inactiveButton}>{value}</button>)}
    </div></div>
    <div className={styles.timelineInfo} aria-busy={resource.status === "loading"}>
      {resource.data ? <div key={year}>{CATEGORIES.map(category =>
        <TopInfoComponent key={category} entityName={category} year={year} data={resource.data[category]} />
      )}</div> : <ContentState {...resource} label={`favorites for ${year}`} />}
    </div>
  </div>
}

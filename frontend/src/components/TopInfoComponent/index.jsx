import IconComponent from "../IconComponent"
import assets from "../../content/assets.json"
import styles from "./styles.module.css"
export default function TopInfoComponent({ year, entityName, data }) {
  const size = assets[`backgrounds/${year}/${entityName}`]
  const source = size.src
  return <article id={entityName} className={styles.activeContainer} aria-labelledby={`${year}-${entityName}-title`}
    style={{ backgroundColor: `${data.color}a8` }}>
    <div className={styles.imageBackground}>
      <img src={source} width={size.width} height={size.height} decoding="async" loading="lazy" alt={`${year} - ${data.title}`} />
    </div>
    <div className={styles.info}>
      <div className={styles.titleContainer}><div>
        <h2 id={`${year}-${entityName}-title`}>{data.title}</h2>
        <div className={styles.subtitle}>{data.subtitle}</div>
      </div><IconComponent entityName={entityName} /></div>
      <div className={styles.description} tabIndex="0" aria-label={`About ${data.title}`}>{data.description}</div>
    </div>
  </article>
}

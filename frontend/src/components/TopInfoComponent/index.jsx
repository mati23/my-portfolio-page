import { useEffect, useState } from "react"
import IconComponent from "../IconComponent"
import assets from "../../content/assets.json"
import styles from "./styles.module.css"
const colorCache = new Map()
export default function TopInfoComponent({ year, entityName, data }) {
  const size = assets[`backgrounds/${year}/${entityName}`]
  const source = size.src
  const [color, setColor] = useState(null)
  useEffect(() => {
    let active = true
    let promise = colorCache.get(source)
    if (!promise) {
      promise = import("../../utils/extractColors").then(({ extractColors }) => extractColors(source))
      colorCache.set(source, promise)
      promise.catch(() => colorCache.delete(source))
    }
    promise.then(colors => { if (active) setColor(colors[0]) }).catch(() => { if (active) setColor(null) })
    return () => { active = false }
  }, [source])
  return <article id={entityName} className={styles.activeContainer} aria-labelledby={`${year}-${entityName}-title`}
    style={{ backgroundColor: color ? `${color}a8` : "#2b4352" }}>
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

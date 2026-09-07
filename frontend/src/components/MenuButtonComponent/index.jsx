import { Link } from "react-router-dom"
import styles from "./styles.module.css"
export default function MenuButtonComponent({ text = "", index = 1, reference }) {
  return <div className={styles.buttonGradient} style={{ marginLeft: index * 20 }}>
    <Link to={reference}>{text}</Link>
  </div>
}

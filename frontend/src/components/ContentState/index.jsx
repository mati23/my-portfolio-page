export default function ContentState({ status, error, retry, label = "content" }) {
  if (status === "loading") return <p className="content-state" role="status">Loading {label}…</p>
  if (status === "error") return <div className="content-state" role="alert">
    <p>{error?.status === 404 ? "This content was not found." : `Unable to load ${label}. Please try again.`}</p>
    <button className="action-link" type="button" onClick={retry}>Try again</button>
  </div>
  return null
}

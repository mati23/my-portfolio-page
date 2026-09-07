import { Component } from "react"
export default class PageErrorBoundary extends Component {
  state = { failed: false }
  static getDerivedStateFromError() { return { failed: true } }
  render() {
    if (this.state.failed) return <main className="content-state" role="alert">
      <h1>Unable to open this page</h1>
      <p>Please reload the page to try again.</p>
      <button className="action-link" onClick={() => window.location.reload()}>Reload page</button>
    </main>
    return this.props.children
  }
}

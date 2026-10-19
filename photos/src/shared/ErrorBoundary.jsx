import { Component } from "react"

// Shows what went wrong instead of a white page, with enough detail to
// report. Wraps each admin route.
export class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { error: null }
  }
  static getDerivedStateFromError(error) {
    return { error }
  }
  componentDidCatch(error, info) {
    console.error("[ui]", error, info?.componentStack)
  }
  componentDidUpdate(prev) {
    if (prev.resetKey !== this.props.resetKey && this.state.error) this.setState({ error: null })
  }
  render() {
    if (!this.state.error) return this.props.children
    const err = this.state.error
    return (
      <div className="mx-auto max-w-2xl p-6">
        <div className="eyebrow mb-2">Something went wrong on this page</div>
        <p className="mb-3 text-sm">Reload to try again. If it keeps happening, send this to support:</p>
        <pre className="overflow-x-auto border u-line p-3 text-xs whitespace-pre-wrap">{String(err?.stack || err?.message || err)}</pre>
      </div>
    )
  }
}

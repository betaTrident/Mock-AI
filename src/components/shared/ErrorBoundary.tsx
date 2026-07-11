"use client"

import { Component, type ErrorInfo, type ReactNode } from "react"
import { AlertTriangleIcon } from "lucide-react"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"

type ErrorBoundaryProps = {
  children: ReactNode
  fallbackTitle?: string
}

type ErrorBoundaryState = {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false, error: null }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("ErrorBoundary caught:", error, info)
    void import("@/lib/sentry").then(({ captureClientError }) => {
      captureClientError(error, { componentStack: info.componentStack ?? undefined })
    })
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError) {
      return (
        <Alert variant="destructive" className="m-4">
          <AlertTriangleIcon />
          <AlertTitle>{this.props.fallbackTitle ?? "Something went wrong"}</AlertTitle>
          <AlertDescription className="flex flex-col gap-3">
            <span>{this.state.error?.message ?? "An unexpected error occurred."}</span>
            <Button variant="outline" size="sm" onClick={this.handleReset}>
              Try again
            </Button>
          </AlertDescription>
        </Alert>
      )
    }

    return this.props.children
  }
}

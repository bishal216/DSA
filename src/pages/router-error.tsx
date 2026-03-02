// src/pages/router-error.tsx
// Replaces React Router's default "404 Not Found — hey developer" screen.

import { isRouteErrorResponse, Link, useRouteError } from "react-router-dom";

export default function RouterError() {
  const error = useRouteError();

  const is404 = isRouteErrorResponse(error) && error.status === 404;

  const title = is404 ? "Page not found" : "Something went wrong";
  const message = is404
    ? "The page you're looking for doesn't exist or has moved."
    : "An unexpected error occurred. Try refreshing the page.";

  // In development, surface the actual error message
  const detail =
    import.meta.env.DEV && !is404
      ? error instanceof Error
        ? error.message
        : isRouteErrorResponse(error)
          ? `${error.status}: ${error.statusText}`
          : String(error)
      : null;

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center space-y-4">
        <p className="font-mono text-5xl font-bold text-primary">
          {is404 ? "404" : "Error"}
        </p>

        <h1 className="text-2xl font-semibold text-foreground">{title}</h1>
        <p className="text-muted-foreground">{message}</p>

        {detail && (
          <pre className="text-left text-xs bg-muted text-muted-foreground p-4 rounded-lg overflow-auto">
            {detail}
          </pre>
        )}

        <div className="flex gap-3 justify-center pt-2">
          <Link
            to="/"
            className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            Go home
          </Link>
          <button
            onClick={() => window.history.back()}
            className="px-4 py-2 rounded-lg border border-border text-sm font-medium hover:bg-muted transition-colors"
          >
            Go back
          </button>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useEffect } from "react";
import * as Sentry from "@sentry/nextjs";

type PayloadAdminErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function PayloadAdminError({ error, reset }: PayloadAdminErrorProps) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        overflow: "hidden",
        fontFamily: "var(--font-body, sans-serif)",
        color: "var(--theme-text, #0b1f3a)",
        backgroundColor: "var(--theme-bg, #ffffff)",
        padding: "2rem",
        textAlign: "center" as const,
      }}
    >
      <div
        style={{
          width: "48px",
          height: "48px",
          borderRadius: "50%",
          backgroundColor: "rgba(220, 38, 38, 0.1)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "1.5rem",
          fontSize: "1.5rem",
        }}
      >
        ⚠
      </div>
      <h1 style={{ fontSize: "1.5rem", fontWeight: 600, margin: 0 }}>Something went wrong</h1>
      <p
        style={{
          marginTop: "0.75rem",
          color: "var(--theme-elevation-500, #6b7280)",
          maxWidth: "400px",
        }}
      >
        An unexpected error occurred. Please try again.
      </p>
      <button
        onClick={reset}
        style={{
          marginTop: "2rem",
          padding: "0.625rem 1.5rem",
          borderRadius: "var(--style-radius-m, 8px)",
          border: "none",
          backgroundColor: "var(--theme-elevation-900, #0b1f3a)",
          color: "var(--theme-elevation-0, #ffffff)",
          fontFamily: "var(--font-body, sans-serif)",
          fontSize: "0.875rem",
          fontWeight: 500,
          cursor: "pointer",
        }}
      >
        Try again
      </button>
    </div>
  );
}

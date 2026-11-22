"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle, RotateCcw } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global application error:", error);
  }, [error]);

  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col items-center justify-center p-4 bg-background text-foreground text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10 text-destructive mb-4">
          <AlertCircle className="h-10 w-10" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight mb-2">Something went seriously wrong</h1>
        <p className="text-muted-foreground text-sm max-w-md mb-6">
          A critical system error occurred. You can retry loading the application or contact support if the problem persists.
        </p>
        <Button onClick={() => reset()} variant="outline">
          <RotateCcw className="mr-2 h-4 w-4" /> Try Again
        </Button>
      </body>
    </html>
  );
}

"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle, RotateCcw } from "lucide-react";

export default function GearError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center p-4 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 text-destructive mb-3">
        <AlertCircle className="h-6 w-6" />
      </div>
      <h3 className="text-xl font-bold mb-1">Failed to load equipment catalog</h3>
      <p className="text-sm text-muted-foreground max-w-sm mb-4">
        {error.message || "An unexpected error occurred while fetching equipment."}
      </p>
      <Button onClick={() => reset()} variant="outline" size="sm">
        <RotateCcw className="mr-2 h-4 w-4" /> Reload
      </Button>
    </div>
  );
}

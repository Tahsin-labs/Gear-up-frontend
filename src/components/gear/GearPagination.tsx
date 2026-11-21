"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface GearPaginationProps {
  totalPages: number;
  currentPage: number;
}

export function GearPagination({ totalPages, currentPage }: GearPaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  if (totalPages <= 1) return null;

  const navigateToPage = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(newPage));
    router.push(`/gear?${params.toString()}`);
  };

  return (
    <div className="flex items-center justify-center gap-2 pt-8">
      <Button
        variant="outline"
        size="sm"
        disabled={currentPage <= 1}
        onClick={() => navigateToPage(currentPage - 1)}
      >
        <ChevronLeft className="h-4 w-4 mr-1" /> Previous
      </Button>

      <span className="text-sm font-medium px-4 text-muted-foreground">
        Page <span className="text-foreground">{currentPage}</span> of <span className="text-foreground">{totalPages}</span>
      </span>

      <Button
        variant="outline"
        size="sm"
        disabled={currentPage >= totalPages}
        onClick={() => navigateToPage(currentPage + 1)}
      >
        Next <ChevronRight className="h-4 w-4 ml-1" />
      </Button>
    </div>
  );
}

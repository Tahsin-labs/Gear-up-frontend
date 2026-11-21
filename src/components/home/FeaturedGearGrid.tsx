"use client";

import Link from "next/link";
import { useGear } from "@/hooks";
import { GearCard } from "@/components/gear/GearCard";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowRight } from "lucide-react";

export function FeaturedGearGrid() {
  const { data, isLoading } = useGear({ limit: 8 });
  const gearItems = data?.data || [];

  return (
    <section className="py-16 px-4 container mx-auto bg-muted/20 rounded-2xl my-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Featured Gear</h2>
          <p className="text-sm text-muted-foreground mt-1">Top-rated equipment ready for immediate reservation</p>
        </div>
        <Link href="/gear" className="text-sm font-semibold text-primary hover:underline flex items-center gap-1">
          Explore all gear <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, idx) => (
            <div key={idx} className="space-y-3">
              <Skeleton className="aspect-[4/3] rounded-xl w-full" />
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-1/3" />
            </div>
          ))}
        </div>
      ) : gearItems.length === 0 ? (
        <div className="p-12 text-center border border-dashed rounded-xl bg-card text-muted-foreground">
          No gear available at the moment. Be the first to list your gear!
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {gearItems.map((item) => (
            <GearCard key={item.id} gear={item} />
          ))}
        </div>
      )}
    </section>
  );
}

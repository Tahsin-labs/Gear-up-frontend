"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useGear } from "@/hooks";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { PageHeader } from "@/components/shared/PageHeader";
import { GearCard } from "@/components/gear/GearCard";
import { GearFilters } from "@/components/gear/GearFilters";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/EmptyState";
import { GearPagination } from "@/components/gear/GearPagination";
import { Compass } from "lucide-react";

function GearList() {
  const searchParams = useSearchParams();

  const search = searchParams.get("search") || undefined;
  const categoryId = searchParams.get("categoryId") || undefined;
  const brand = searchParams.get("brand") || undefined;
  const minPrice = searchParams.get("minPrice") ? Number(searchParams.get("minPrice")) : undefined;
  const maxPrice = searchParams.get("maxPrice") ? Number(searchParams.get("maxPrice")) : undefined;
  const page = Number(searchParams.get("page")) || 1;
  const limit = 12;

  const { data, isLoading } = useGear({
    search,
    categoryId,
    brand,
    minPrice,
    maxPrice,
    page,
    limit,
  });

  const gearItems = data?.data || [];

  return (
    <div className="flex-1">
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, idx) => (
            <div key={idx} className="space-y-3">
              <Skeleton className="aspect-[4/3] rounded-xl w-full" />
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-1/3" />
            </div>
          ))}
        </div>
      ) : gearItems.length === 0 ? (
        <EmptyState
          title="No equipment found"
          description="Try broadening your search keywords or resetting price and category filters."
          icon={<Compass className="h-8 w-8 text-muted-foreground" />}
        />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {gearItems.map((item) => (
              <GearCard key={item.id} gear={item} />
            ))}
          </div>
          <GearPagination
            totalPages={data?.meta?.totalPages || 1}
            currentPage={page}
          />
        </>
      )}
    </div>
  );
}

export default function BrowseGearPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        <PageHeader
          title="Explore Equipment"
          description="Discover professional cameras, lenses, camping setups, and tech gear available for rent."
        />

        <div className="flex flex-col md:flex-row gap-8 mt-8">
          <aside className="w-full md:w-64 shrink-0">
            <Suspense fallback={<div>Loading filters...</div>}>
              <GearFilters />
            </Suspense>
          </aside>

          <Suspense fallback={<div>Loading gear list...</div>}>
            <GearList />
          </Suspense>
        </div>
      </main>
      <Footer />
    </div>
  );
}

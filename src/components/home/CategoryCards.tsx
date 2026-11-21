"use client";

import Link from "next/link";
import { useCategories } from "@/hooks";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Layers, ArrowRight } from "lucide-react";

export function CategoryCards() {
  const { data, isLoading } = useCategories();
  const categories = data?.data || [];

  return (
    <section className="py-16 px-4 container mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Browse by Category</h2>
          <p className="text-sm text-muted-foreground mt-1">Explore specialized gear tailored for your specific projects</p>
        </div>
        <Link href="/gear" className="text-sm font-semibold text-primary hover:underline flex items-center gap-1">
          View all <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {Array.from({ length: 6 }).map((_, idx) => (
            <Skeleton key={idx} className="h-28 rounded-xl" />
          ))}
        </div>
      ) : categories.length === 0 ? (
        <div className="p-8 text-center border rounded-xl bg-card text-muted-foreground text-sm">
          No categories found.
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {categories.map((cat) => (
            <Link key={cat.id} href={`/gear?categoryId=${cat.id}`}>
              <Card className="h-full hover:border-primary hover:shadow-md transition-all cursor-pointer group">
                <CardContent className="flex flex-col items-center justify-center p-6 text-center space-y-2">
                  <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <Layers className="h-5 w-5" />
                  </div>
                  <h3 className="font-semibold text-sm group-hover:text-primary transition-colors line-clamp-1">
                    {cat.name}
                  </h3>
                  {cat.description && (
                    <p className="text-xs text-muted-foreground line-clamp-1">
                      {cat.description}
                    </p>
                  )}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}

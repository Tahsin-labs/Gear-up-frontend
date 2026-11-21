"use client";

import { use } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { useGearById } from "@/hooks";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { ImageGallery } from "@/components/gear/ImageGallery";
import { SpecsCard } from "@/components/gear/SpecsCard";
import { ProviderReviewsCard } from "@/components/gear/ProviderReviewsCard";
import { RentalBookingCard } from "@/components/gear/RentalBookingCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { ChevronRight, ArrowLeft } from "lucide-react";

export default function GearDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data, isLoading } = useGearById(id);
  const gear = data?.data;

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-8 space-y-6">
          <Skeleton className="h-6 w-48" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Skeleton className="aspect-[4/3] rounded-2xl w-full" />
              <Skeleton className="h-28 rounded-xl" />
            </div>
            <Skeleton className="h-96 rounded-2xl" />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!gear) {
    notFound();
  }

  const price = typeof gear.pricePerDay === "number"
    ? gear.pricePerDay
    : parseFloat(gear.pricePerDay as string) || 0;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        {/* Breadcrumb navigation */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-6">
          <Link href="/gear" className="hover:text-foreground flex items-center gap-1">
            <ArrowLeft className="h-3 w-3" /> Back to Equipment
          </Link>
          <ChevronRight className="h-3 w-3" />
          <span>{gear.category?.name || "Gear"}</span>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground font-medium truncate max-w-xs">{gear.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Column */}
          <div className="lg:col-span-2 space-y-8">
            <ImageGallery images={[gear.imageUrl]} name={gear.name} />

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs uppercase tracking-wider font-semibold">
                  {gear.brand}
                </Badge>
                {gear.category?.name && (
                  <Badge variant="secondary" className="text-xs">
                    {gear.category.name}
                  </Badge>
                )}
              </div>
              <h1 className="text-3xl font-extrabold tracking-tight">{gear.name}</h1>
              <div className="prose prose-sm max-w-none text-muted-foreground leading-relaxed">
                <p>{gear.description}</p>
              </div>
            </div>

            <SpecsCard gear={gear} />

            <ProviderReviewsCard
              provider={gear.provider}
              reviews={gear.reviews}
            />
          </div>

          {/* Sidebar Booking Column */}
          <div>
            <RentalBookingCard
              gearId={gear.id}
              pricePerDay={price}
              stock={gear.stock}
              providerId={gear.providerId}
            />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

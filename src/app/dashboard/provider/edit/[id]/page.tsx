"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { GearForm } from "@/components/dashboard/GearForm";
import { GearFormData } from "@/lib/validations/gear";
import { useGearById, useUpdateGear } from "@/hooks";
import { Skeleton } from "@/components/ui/skeleton";

export default function EditGearPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();

  const { data, isLoading } = useGearById(id);
  const gear = data?.data;
  const updateGearMutation = useUpdateGear();

  const handleSubmit = async (formData: GearFormData) => {
    await updateGearMutation.mutateAsync({
      id,
      payload: {
        name: formData.name,
        brand: formData.brand,
        description: formData.description,
        categoryId: formData.categoryId,
        pricePerDay: formData.pricePerDay,
        stock: formData.stock,
        imageUrl: formData.images[0] || gear?.imageUrl || "",
      },
    });
    router.push("/dashboard/provider");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 flex flex-col md:flex-row container mx-auto px-4 py-8 gap-8">
        <DashboardSidebar />
        <main className="flex-1 min-w-0">
          {isLoading || !gear ? (
            <div className="max-w-3xl mx-auto space-y-4">
              <Skeleton className="h-10 w-48" />
              <Skeleton className="h-64 rounded-xl" />
            </div>
          ) : (
            <GearForm
              title={`Edit: ${gear.name}`}
              description="Update equipment rates, photos, or description details."
              initialData={{
                name: gear.name,
                brand: gear.brand,
                description: gear.description,
                categoryId: gear.categoryId,
                pricePerDay: Number(gear.pricePerDay),
                stock: gear.stock,
                images: [gear.imageUrl].filter(Boolean),
              }}
              onSubmit={handleSubmit}
              isSubmitting={updateGearMutation.isPending}
            />
          )}
        </main>
      </div>
      <Footer />
    </div>
  );
}

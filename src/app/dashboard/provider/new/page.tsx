"use client";

import { useRouter } from "next/navigation";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { GearForm } from "@/components/dashboard/GearForm";
import { GearFormData } from "@/lib/validations/gear";
import { useCreateGear } from "@/hooks";

export default function NewGearPage() {
  const router = useRouter();
  const createGearMutation = useCreateGear();

  const handleSubmit = async (data: GearFormData) => {
    await createGearMutation.mutateAsync({
      name: data.name,
      brand: data.brand,
      description: data.description,
      categoryId: data.categoryId,
      pricePerDay: data.pricePerDay,
      stock: data.stock,
      imageUrl: data.images[0] || "",
    });
    router.push("/dashboard/provider");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 flex flex-col md:flex-row container mx-auto px-4 py-8 gap-8">
        <DashboardSidebar />
        <main className="flex-1 min-w-0">
          <GearForm
            title="List New Equipment"
            description="Add equipment details, pricing, and upload photos to make it available for rental."
            onSubmit={handleSubmit}
            isSubmitting={createGearMutation.isPending}
          />
        </main>
      </div>
      <Footer />
    </div>
  );
}

"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/providers/auth-provider";
import { useGear, useProviderOrders } from "@/hooks";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { PageHeader } from "@/components/shared/PageHeader";
import { ProviderStats } from "@/components/dashboard/ProviderStats";
import { ProviderInventoryTable } from "@/components/dashboard/ProviderInventoryTable";
import { ProviderOrdersTable } from "@/components/dashboard/ProviderOrdersTable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus } from "lucide-react";

export default function ProviderDashboardPage() {
  const searchParams = useSearchParams();
  const currentTab = searchParams.get("tab") || "inventory";
  const { user } = useAuth();
  const { data: gearData, isLoading: loadingGear } = useGear();
  const { data: ordersData, isLoading: loadingOrders } = useProviderOrders();

  const allGear = gearData?.data || [];
  // Filter gear owned by the logged-in provider
  const myGear = allGear.filter((g) => g.providerId === user?.id || !g.providerId);
  const myOrders = ordersData?.data || [];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 flex flex-col md:flex-row container mx-auto px-4 py-8 gap-8">
        <DashboardSidebar />
        <main className="flex-1 space-y-8 min-w-0">
          <PageHeader
            title="Provider Portal"
            description="Manage your rental inventory, fulfill customer booking requests, and track returns."
          >
            <Link href="/dashboard/provider/new" className={cn(buttonVariants({ size: "sm" }))}>
              <Plus className="h-4 w-4 mr-1" /> Add New Gear
            </Link>
          </PageHeader>

          {loadingGear || loadingOrders ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, idx) => (
                <Skeleton key={idx} className="h-28 rounded-xl" />
              ))}
            </div>
          ) : (
            <ProviderStats gearItems={myGear} orders={myOrders} />
          )}

          <Tabs defaultValue={currentTab} key={currentTab} className="space-y-6">
            <TabsList>
              <TabsTrigger value="inventory">My Equipment Inventory</TabsTrigger>
              <TabsTrigger value="orders">
                Incoming Orders {myOrders.filter((o) => o.status === "PENDING").length > 0 && `(${myOrders.filter((o) => o.status === "PENDING").length})`}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="inventory">
              <ProviderInventoryTable gearItems={myGear} />
            </TabsContent>

            <TabsContent value="orders">
              <ProviderOrdersTable orders={myOrders} />
            </TabsContent>
          </Tabs>
        </main>
      </div>
      <Footer />
    </div>
  );
}

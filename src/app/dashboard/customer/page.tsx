"use client";

import { useRentals } from "@/hooks";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { PageHeader } from "@/components/shared/PageHeader";
import { CustomerStats } from "@/components/dashboard/CustomerStats";
import { CustomerOrdersTable } from "@/components/dashboard/CustomerOrdersTable";
import { CustomerPaymentsTable } from "@/components/dashboard/CustomerPaymentsTable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";

export default function CustomerDashboardPage() {
  const { data, isLoading } = useRentals();
  const rentals = data?.data || [];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 flex flex-col md:flex-row container mx-auto px-4 py-8 gap-8">
        <DashboardSidebar />

        <main className="flex-1 space-y-8 min-w-0">
          <PageHeader
            title="Customer Dashboard"
            description="Manage your gear reservations, track status, and view past payments."
          />

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, idx) => (
                <Skeleton key={idx} className="h-28 rounded-xl" />
              ))}
            </div>
          ) : (
            <CustomerStats rentals={rentals} />
          )}

          <Tabs defaultValue="orders" className="space-y-6">
            <TabsList>
              <TabsTrigger value="orders">My Rental Bookings</TabsTrigger>
              <TabsTrigger value="payments">Payment History</TabsTrigger>
            </TabsList>

            <TabsContent value="orders">
              <CustomerOrdersTable rentals={rentals} />
            </TabsContent>

            <TabsContent value="payments">
              <CustomerPaymentsTable />
            </TabsContent>
          </Tabs>
        </main>
      </div>
      <Footer />
    </div>
  );
}

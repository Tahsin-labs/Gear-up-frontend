"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api/endpoints";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { PageHeader } from "@/components/shared/PageHeader";
import { AdminStats } from "@/components/dashboard/AdminStats";
import { AdminUsersTable } from "@/components/dashboard/AdminUsersTable";
import { AdminGearTable } from "@/components/dashboard/AdminGearTable";
import { AdminRentalsTable } from "@/components/dashboard/AdminRentalsTable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminDashboardPage() {
  const { data: usersData, isLoading: loadingUsers } = useQuery({
    queryKey: ["admin", "users"],
    queryFn: () => api.admin.getUsers(),
  });

  const { data: gearData, isLoading: loadingGear } = useQuery({
    queryKey: ["admin", "gear"],
    queryFn: () => api.admin.getGear(),
  });

  const { data: rentalsData, isLoading: loadingRentals } = useQuery({
    queryKey: ["admin", "rentals"],
    queryFn: () => api.admin.getRentals(),
  });

  const users = usersData?.data || [];
  const gear = gearData?.data || [];
  const rentals = rentalsData?.data || [];

  const isLoading = loadingUsers || loadingGear || loadingRentals;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 flex flex-col md:flex-row container mx-auto px-4 py-8 gap-8">
        <DashboardSidebar />
        <main className="flex-1 space-y-8 min-w-0">
          <PageHeader
            title="Administrator Control Center"
            description="Moderate accounts, manage inventory catalog, and supervise platform rental activity."
          />

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, idx) => (
                <Skeleton key={idx} className="h-28 rounded-xl" />
              ))}
            </div>
          ) : (
            <AdminStats
              userCount={users.length}
              gearCount={gear.length}
              rentalCount={rentals.length}
            />
          )}

          <Tabs defaultValue="users" className="space-y-6">
            <TabsList>
              <TabsTrigger value="users">Users ({users.length})</TabsTrigger>
              <TabsTrigger value="gear">Platform Gear ({gear.length})</TabsTrigger>
              <TabsTrigger value="rentals">All Rentals ({rentals.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="users">
              <AdminUsersTable users={users} />
            </TabsContent>

            <TabsContent value="gear">
              <AdminGearTable gearItems={gear} />
            </TabsContent>

            <TabsContent value="rentals">
              <AdminRentalsTable rentals={rentals} />
            </TabsContent>
          </Tabs>
        </main>
      </div>
      <Footer />
    </div>
  );
}

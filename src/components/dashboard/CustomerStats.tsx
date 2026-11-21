import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, CalendarCheck2, CheckCircle, Clock } from "lucide-react";
import { Rental } from "@/types";

interface CustomerStatsProps {
  rentals: Rental[];
}

export function CustomerStats({ rentals }: CustomerStatsProps) {
  const totalBookings = rentals.length;
  const activeRentals = rentals.filter((r) => r.status === "ACTIVE" || r.status === "CONFIRMED").length;
  const pendingOrders = rentals.filter((r) => r.status === "PENDING").length;
  const completedRentals = rentals.filter((r) => r.status === "COMPLETED").length;

  const stats = [
    {
      title: "Total Bookings",
      value: totalBookings,
      desc: "All rentals placed",
      icon: CalendarCheck2,
      color: "text-blue-600 bg-blue-100",
    },
    {
      title: "Active & Confirmed",
      value: activeRentals,
      desc: "Currently reserved or active",
      icon: Clock,
      color: "text-emerald-600 bg-emerald-100",
    },
    {
      title: "Pending Approval",
      value: pendingOrders,
      desc: "Awaiting provider confirmation",
      icon: Package,
      color: "text-amber-600 bg-amber-100",
    },
    {
      title: "Completed Trips",
      value: completedRentals,
      desc: "Successfully returned gear",
      icon: CheckCircle,
      color: "text-purple-600 bg-purple-100",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((s) => {
        const Icon = s.icon;
        return (
          <Card key={s.title} className="border-muted">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {s.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${s.color}`}>
                <Icon className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{s.value}</div>
              <p className="text-xs text-muted-foreground mt-1">{s.desc}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

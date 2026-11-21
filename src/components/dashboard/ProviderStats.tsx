import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, CalendarCheck2, Clock, CheckCircle } from "lucide-react";
import { GearItem, Rental } from "@/types";

interface ProviderStatsProps {
  gearItems: GearItem[];
  orders: Rental[];
}

export function ProviderStats({ gearItems, orders }: ProviderStatsProps) {
  const totalGear = gearItems.length;
  const activeRentals = orders.filter((o) => o.status === "ACTIVE" || o.status === "CONFIRMED").length;
  const pendingOrders = orders.filter((o) => o.status === "PENDING").length;
  const completedOrders = orders.filter((o) => o.status === "COMPLETED").length;

  const stats = [
    {
      title: "Gear Listed",
      value: totalGear,
      desc: "Equipment in your catalog",
      icon: Package,
      color: "text-blue-600 bg-blue-100",
    },
    {
      title: "Active Rentals",
      value: activeRentals,
      desc: "Currently with customers",
      icon: Clock,
      color: "text-emerald-600 bg-emerald-100",
    },
    {
      title: "Pending Orders",
      value: pendingOrders,
      desc: "Awaiting your confirmation",
      icon: CalendarCheck2,
      color: "text-amber-600 bg-amber-100",
    },
    {
      title: "Completed Rentals",
      value: completedOrders,
      desc: "Returned and inspected",
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

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Package, CalendarCheck2, ShieldCheck } from "lucide-react";

interface AdminStatsProps {
  userCount: number;
  gearCount: number;
  rentalCount: number;
}

export function AdminStats({ userCount, gearCount, rentalCount }: AdminStatsProps) {
  const stats = [
    {
      title: "Registered Users",
      value: userCount,
      desc: "Customers & Providers",
      icon: Users,
      color: "text-blue-600 bg-blue-100",
    },
    {
      title: "Platform Equipment",
      value: gearCount,
      desc: "Total gear catalog items",
      icon: Package,
      color: "text-emerald-600 bg-emerald-100",
    },
    {
      title: "All-Time Rentals",
      value: rentalCount,
      desc: "Processed booking reservations",
      icon: CalendarCheck2,
      color: "text-purple-600 bg-purple-100",
    },
    {
      title: "Platform Health",
      value: "100%",
      desc: "All operational services active",
      icon: ShieldCheck,
      color: "text-amber-600 bg-amber-100",
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

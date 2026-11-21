"use client";

import { usePayments } from "@/hooks";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

export function CustomerPaymentsTable() {
  const { data, isLoading } = usePayments();
  const payments = data?.data || [];

  if (isLoading) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    );
  }

  if (payments.length === 0) {
    return (
      <div className="p-8 text-center text-sm text-muted-foreground border border-dashed rounded-xl">
        No payment transactions recorded yet.
      </div>
    );
  }

  return (
    <div className="rounded-xl border overflow-hidden bg-card">
      <Table>
        <TableHeader className="bg-muted/50">
          <TableRow>
            <TableHead>Payment ID</TableHead>
            <TableHead>Gear / Rental</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Provider</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {payments.map((p) => (
            <TableRow key={p.id}>
              <TableCell className="font-mono text-xs text-muted-foreground">
                {p.id.slice(0, 8)}...
              </TableCell>
              <TableCell className="font-semibold text-sm">
                {p.rental?.gear?.name || `Rental ${p.rentalId?.slice(0, 6)}`}
              </TableCell>
              <TableCell className="font-bold text-sm">
                ${p.amount}
              </TableCell>
              <TableCell className="text-xs uppercase font-medium">
                {p.provider}
              </TableCell>
              <TableCell>
                <Badge
                  variant={
                    p.status === "COMPLETED"
                      ? "default"
                      : p.status === "FAILED"
                      ? "destructive"
                      : "secondary"
                  }
                  className="text-xs"
                >
                  {p.status}
                </Badge>
              </TableCell>
              <TableCell className="text-xs text-muted-foreground">
                {p.createdAt ? format(new Date(p.createdAt), "MMM dd, yyyy") : "-"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

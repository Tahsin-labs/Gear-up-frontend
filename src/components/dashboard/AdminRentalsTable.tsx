"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Rental, RentalStatus } from "@/types";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface AdminRentalsTableProps {
  rentals: Rental[];
}

export function AdminRentalsTable({ rentals }: AdminRentalsTableProps) {
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  const filtered = rentals.filter((r) => {
    if (statusFilter === "ALL") return true;
    return r.status === statusFilter;
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="w-56">
          <Select value={statusFilter} onValueChange={(val) => setStatusFilter(val || "ALL")}>
            <SelectTrigger className="h-9 text-xs">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Statuses</SelectItem>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="CONFIRMED">Confirmed</SelectItem>
              <SelectItem value="ACTIVE">Active</SelectItem>
              <SelectItem value="COMPLETED">Completed</SelectItem>
              <SelectItem value="CANCELLED">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <span className="text-xs text-muted-foreground">
          Showing {filtered.length} of {rentals.length} bookings
        </span>
      </div>

      <div className="rounded-xl border overflow-hidden bg-card">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead>Rental ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Gear</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Total Price</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-sm text-muted-foreground">
                  No rentals match the selected status filter.
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((rental) => (
                <TableRow key={rental.id}>
                  <TableCell className="font-mono text-xs text-muted-foreground">
                    {rental.id.slice(0, 8)}...
                  </TableCell>
                  <TableCell className="text-sm font-medium">
                    {rental.customer?.name || rental.customerId?.slice(0, 8)}
                  </TableCell>
                  <TableCell className="text-sm font-semibold">
                    {rental.gear?.name || rental.gearId?.slice(0, 8)}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {format(new Date(rental.startDate), "MMM dd")} - {format(new Date(rental.endDate), "MMM dd, yyyy")}
                  </TableCell>
                  <TableCell className="font-bold text-sm">
                    ${rental.totalPrice}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={rental.status} />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

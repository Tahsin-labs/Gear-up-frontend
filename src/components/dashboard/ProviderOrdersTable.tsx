"use client";

import { useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { Rental, RentalStatus } from "@/types";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Check, CheckCircle2, RotateCcw, X, Loader2 } from "lucide-react";
import { useUpdateRentalStatus } from "@/hooks";

interface ProviderOrdersTableProps {
  orders: Rental[];
}

export function ProviderOrdersTable({ orders }: ProviderOrdersTableProps) {
  const queryClient = useQueryClient();
  const statusMutation = useUpdateRentalStatus();

  const handleStatusChange = (orderId: string, status: RentalStatus) => {
    // Perform status update
    statusMutation.mutate(
      { id: orderId, status },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["rentals", "provider"] });
        },
      }
    );
  };

  if (orders.length === 0) {
    return (
      <div className="p-12 text-center border border-dashed rounded-xl text-sm text-muted-foreground">
        No rental booking requests received yet.
      </div>
    );
  }

  return (
    <div className="rounded-xl border overflow-hidden bg-card">
      <Table>
        <TableHeader className="bg-muted/50">
          <TableRow>
            <TableHead>Customer</TableHead>
            <TableHead>Gear Item</TableHead>
            <TableHead>Rental Dates</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => {
            const startDate = new Date(order.startDate);
            const endDate = new Date(order.endDate);

            return (
              <TableRow key={order.id}>
                <TableCell>
                  <div className="font-semibold text-sm">
                    {order.customer?.name || "Customer"}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {order.customer?.email}
                  </div>
                </TableCell>
                <TableCell className="font-medium text-sm">
                  {order.gear?.name || "Gear"}
                </TableCell>
                <TableCell className="text-xs">
                  <div>{format(startDate, "MMM dd")} - {format(endDate, "MMM dd, yyyy")}</div>
                </TableCell>
                <TableCell className="font-bold text-sm">
                  ${order.totalPrice}
                </TableCell>
                <TableCell>
                  <StatusBadge status={order.status} />
                </TableCell>
                <TableCell className="text-right space-x-1.5">
                  {/* Status transitions:
                      PENDING -> CONFIRMED, CANCELLED
                      CONFIRMED -> ACTIVE, CANCELLED
                      ACTIVE -> COMPLETED
                  */}
                  {order.status === "PENDING" && (
                    <>
                      <Button
                        size="sm"
                        onClick={() => handleStatusChange(order.id, "CONFIRMED")}
                        disabled={statusMutation.isPending}
                        className="h-8 text-xs bg-emerald-600 hover:bg-emerald-700"
                      >
                        <Check className="h-3.5 w-3.5 mr-1" /> Confirm
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleStatusChange(order.id, "CANCELLED")}
                        disabled={statusMutation.isPending}
                        className="h-8 text-xs text-destructive hover:bg-destructive/10"
                      >
                        <X className="h-3.5 w-3.5 mr-1" /> Decline
                      </Button>
                    </>
                  )}

                  {order.status === "CONFIRMED" && (
                    <Button
                      size="sm"
                      onClick={() => handleStatusChange(order.id, "ACTIVE")}
                      disabled={statusMutation.isPending}
                      className="h-8 text-xs bg-blue-600 hover:bg-blue-700"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5 mr-1" /> Mark Picked Up
                    </Button>
                  )}

                  {order.status === "ACTIVE" && (
                    <Button
                      size="sm"
                      onClick={() => handleStatusChange(order.id, "COMPLETED")}
                      disabled={statusMutation.isPending}
                      className="h-8 text-xs"
                    >
                      <RotateCcw className="h-3.5 w-3.5 mr-1" /> Mark Returned
                    </Button>
                  )}

                  {(order.status === "COMPLETED" || order.status === "CANCELLED") && (
                    <span className="text-xs text-muted-foreground italic">No action needed</span>
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}

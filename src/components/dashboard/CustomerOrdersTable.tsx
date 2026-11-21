"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import { Rental } from "@/types";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { usePayNow } from "@/hooks/usePayNow";
import { CreditCard, Ban, Star, Loader2 } from "lucide-react";
import { ReviewModal } from "@/components/dashboard/ReviewModal";
import { toast } from "sonner";
import { api } from "@/lib/api/endpoints";
import { useQueryClient } from "@tanstack/react-query";

interface OrdersTableProps {
  rentals: Rental[];
}

export function CustomerOrdersTable({ rentals }: OrdersTableProps) {
  const queryClient = useQueryClient();
  const payNowMutation = usePayNow();

  const [cancelTarget, setCancelTarget] = useState<Rental | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);
  const [reviewTarget, setReviewTarget] = useState<Rental | null>(null);

  const handleCancel = async () => {
    if (!cancelTarget) return;
    setIsCancelling(true);
    try {
      await api.rentals.updateStatus(cancelTarget.id, "CANCELLED");
      toast.success("Rental cancelled successfully");
      queryClient.invalidateQueries({ queryKey: ["rentals"] });
      setCancelTarget(null);
    } catch (err: unknown) {
      toast.error((err as { message?: string })?.message || "Failed to cancel rental");
    } finally {
      setIsCancelling(false);
    }
  };

  if (rentals.length === 0) {
    return (
      <div className="p-8 text-center text-sm text-muted-foreground border border-dashed rounded-xl">
        You haven&apos;t placed any rental bookings yet.
      </div>
    );
  }

  return (
    <>
      <div className="rounded-xl border overflow-hidden bg-card">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead>Gear Item</TableHead>
              <TableHead>Dates</TableHead>
              <TableHead>Total Price</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rentals.map((rental) => {
              const startDate = new Date(rental.startDate);
              const endDate = new Date(rental.endDate);
              const isPlaced = rental.status === "PENDING";
              const isConfirmed = rental.status === "CONFIRMED";
              const isReturned = rental.status === "COMPLETED";

              return (
                <TableRow key={rental.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="relative h-12 w-12 rounded-lg overflow-hidden bg-muted shrink-0">
                        <Image
                          src={rental.gear?.imageUrl || "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800"}
                          alt={rental.gear?.name || "Gear"}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <Link href={`/gear/${rental.gearId}`} className="font-semibold text-sm hover:underline line-clamp-1">
                          {rental.gear?.name || "Gear Item"}
                        </Link>
                        <span className="text-xs text-muted-foreground font-mono">ID: {rental.id.slice(0, 8)}...</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-xs">
                    <div>{format(startDate, "MMM dd, yyyy")}</div>
                    <div className="text-muted-foreground">to {format(endDate, "MMM dd, yyyy")}</div>
                  </TableCell>
                  <TableCell className="font-semibold text-sm">
                    ${rental.totalPrice}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={rental.status} />
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    {/* Pay Now for CONFIRMED */}
                    {isConfirmed && (
                      <Button
                        size="sm"
                        onClick={() => payNowMutation.mutate(rental.id)}
                        disabled={payNowMutation.isPending}
                        className="h-8 text-xs bg-purple-600 hover:bg-purple-700"
                      >
                        <CreditCard className="h-3.5 w-3.5 mr-1" />
                        {payNowMutation.isPending ? "Connecting..." : "Pay Now"}
                      </Button>
                    )}

                    {/* Cancel for PENDING / PLACED */}
                    {isPlaced && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setCancelTarget(rental)}
                        className="h-8 text-xs text-destructive hover:bg-destructive/10"
                      >
                        <Ban className="h-3.5 w-3.5 mr-1" /> Cancel
                      </Button>
                    )}

                    {/* Leave Review for COMPLETED / RETURNED */}
                    {isReturned && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setReviewTarget(rental)}
                        className="h-8 text-xs"
                      >
                        <Star className="h-3.5 w-3.5 mr-1 text-amber-500 fill-amber-500" />
                        {rental.review ? "Reviewed" : "Review"}
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Cancel Confirmation Dialog */}
      <Dialog open={Boolean(cancelTarget)} onOpenChange={(open) => !open && setCancelTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Rental Booking</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel your reservation for{" "}
              <span className="font-semibold text-foreground">{cancelTarget?.gear?.name}</span>? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCancelTarget(null)} disabled={isCancelling}>
              Keep Reservation
            </Button>
            <Button variant="destructive" onClick={handleCancel} disabled={isCancelling}>
              {isCancelling ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : null}
              Confirm Cancellation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Review Modal */}
      {reviewTarget && (
        <ReviewModal
          rental={reviewTarget}
          onClose={() => setReviewTarget(null)}
        />
      )}
    </>
  );
}

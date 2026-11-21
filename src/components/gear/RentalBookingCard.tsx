"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { DateRange } from "react-day-picker";
import { format, differenceInCalendarDays, isWithinInterval, startOfDay } from "date-fns";
import { Calendar as CalendarIcon, Loader2, ShieldAlert } from "lucide-react";
import { useAuth } from "@/providers/auth-provider";
import { useCreateRental, useGearAvailability } from "@/hooks";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface RentalBookingCardProps {
  gearId: string;
  pricePerDay: number;
  stock: number;
  providerId: string;
}

export function RentalBookingCard({
  gearId,
  pricePerDay,
  stock,
  providerId,
}: RentalBookingCardProps) {
  const router = useRouter();
  const { user } = useAuth();
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);

  const { data: availabilityData, isLoading: loadingAvailability } = useGearAvailability(gearId);
  const bookedRanges = availabilityData?.data || [];

  const createRentalMutation = useCreateRental();

  const from = dateRange?.from;
  const to = dateRange?.to;

  const totalDays = from && to ? Math.max(1, differenceInCalendarDays(to, from)) : 0;
  const totalPrice = totalDays * pricePerDay;

  // Check if a given date falls inside any active booked range
  const isDateBooked = (day: Date) => {
    const today = startOfDay(new Date());
    if (day < today) return true;

    return bookedRanges.some((range) => {
      const start = startOfDay(new Date(range.startDate));
      const end = startOfDay(new Date(range.endDate));
      return isWithinInterval(day, { start, end });
    });
  };

  const handleBooking = async () => {
    if (!user) {
      toast.error("Please sign in to rent this equipment");
      router.push(`/login?from=/gear/${gearId}`);
      return;
    }

    if (user.role !== "CUSTOMER") {
      toast.error("Only Customer accounts can create gear rental bookings");
      return;
    }

    if (user.id === providerId) {
      toast.error("You cannot rent your own listed equipment");
      return;
    }

    if (!from || !to) {
      toast.error("Please select valid rental start and end dates");
      return;
    }

    try {
      await createRentalMutation.mutateAsync({
        gearId,
        startDate: from.toISOString(),
        endDate: to.toISOString(),
      });
      router.push("/dashboard/customer");
    } catch {
      // Error handled by mutation toast
    }
  };

  return (
    <Card className="sticky top-24 border-primary/20 shadow-xl">
      <CardHeader className="pb-3 border-b">
        <div className="flex items-baseline justify-between">
          <div>
            <span className="text-3xl font-extrabold text-primary">${pricePerDay}</span>
            <span className="text-sm font-normal text-muted-foreground"> / day</span>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-muted text-muted-foreground">
            {stock} Available
          </span>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 pt-5">
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block">
            Select Rental Period
          </label>
          <Popover>
            <PopoverTrigger className={cn(
              "w-full justify-start text-left font-normal h-11 border rounded-xl px-3.5 flex items-center bg-background shadow-sm",
              !dateRange && "text-muted-foreground"
            )}>
              <CalendarIcon className="mr-2 h-4 w-4 text-primary" />
              {from ? (
                to ? (
                  <span className="text-sm font-medium">
                    {format(from, "MMM dd")} - {format(to, "MMM dd, yyyy")}
                  </span>
                ) : (
                  <span className="text-sm font-medium">From: {format(from, "MMM dd, yyyy")}</span>
                )
              ) : (
                <span className="text-sm">Choose reservation dates</span>
              )}
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={from || new Date()}
                selected={dateRange}
                onSelect={setDateRange}
                numberOfMonths={1}
                disabled={isDateBooked}
              />
            </PopoverContent>
          </Popover>
          <p className="text-[11px] text-muted-foreground">
            Unavailable dates are automatically disabled based on current bookings.
          </p>
        </div>

        {totalDays > 0 && (
          <div className="space-y-2 pt-2 border-t text-sm">
            <div className="flex justify-between text-muted-foreground">
              <span>${pricePerDay} × {totalDays} {totalDays === 1 ? "day" : "days"}</span>
              <span>${totalPrice}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Service & Protection Fee</span>
              <span className="text-emerald-600 font-medium">$0.00 (Included)</span>
            </div>
            <div className="flex justify-between pt-2 border-t font-bold text-base text-foreground">
              <span>Total Rental Price</span>
              <span className="text-primary">${totalPrice}</span>
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="flex flex-col gap-2 pt-2">
        <Button
          onClick={handleBooking}
          disabled={!from || !to || createRentalMutation.isPending || loadingAvailability}
          className="w-full h-11 text-base font-semibold shadow-md"
        >
          {createRentalMutation.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing Booking...
            </>
          ) : !user ? (
            "Sign In to Rent"
          ) : user.role !== "CUSTOMER" ? (
            "Customer Account Required"
          ) : (
            `Reserve for $${totalPrice || pricePerDay}`
          )}
        </Button>
        <p className="text-center text-[11px] text-muted-foreground">
          You won&apos;t be charged until the booking is confirmed by the provider.
        </p>
      </CardFooter>
    </Card>
  );
}

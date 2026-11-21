"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon, X } from "lucide-react";
import { DateRange } from "react-day-picker";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface DateFilterProps {
  onSelectRange?: (range: DateRange | undefined) => void;
}

export function AvailabilityDateFilter({ onSelectRange }: DateFilterProps) {
  const [date, setDate] = useState<DateRange | undefined>(undefined);

  const handleSelect = (range: DateRange | undefined) => {
    setDate(range);
    onSelectRange?.(range);
  };

  const clear = () => {
    setDate(undefined);
    onSelectRange?.(undefined);
  };

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium">Availability Dates</span>
        {date && (
          <button
            type="button"
            onClick={clear}
            className="text-[11px] text-muted-foreground hover:text-foreground flex items-center gap-0.5"
          >
            <X className="h-3 w-3" /> Clear
          </button>
        )}
      </div>
      <Popover>
        <PopoverTrigger className={cn(
          "w-full justify-start text-left font-normal h-9 text-xs border rounded-md px-3 flex items-center bg-background",
          !date && "text-muted-foreground"
        )}>
          <CalendarIcon className="mr-2 h-3.5 w-3.5" />
          {date?.from ? (
            date.to ? (
              <>
                {format(date.from, "LLL dd")} - {format(date.to, "LLL dd, y")}
              </>
            ) : (
              format(date.from, "LLL dd, y")
            )
          ) : (
            <span>Pick trip dates</span>
          )}
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="range"
            defaultMonth={date?.from || new Date()}
            selected={date}
            onSelect={handleSelect}
            numberOfMonths={1}
            disabled={(day) => day < new Date(new Date().setHours(0, 0, 0, 0))}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}

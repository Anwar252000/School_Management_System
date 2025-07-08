"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
//import { useTheme } from "next-themes";

// Define the type for the date object
interface DateRange {
  from: Date | undefined;
}

interface DatePickerProps {
  className?: string;
  disabled?: boolean;
}

export default function DatePicker({ className, disabled }: DatePickerProps) {
  const [date, setDate] = React.useState<Date | undefined>(undefined);

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="cursor-pointer text-slate-500">
            <CalendarIcon className="m-4 h-4 w-4" />
            {date ? (
              format(date, "LLL dd, y")
            ) : (
              <span>Select Date of Birth</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="end">
          <Calendar
            initialFocus
            mode="single"
            defaultMonth={date ?? undefined}
            selected={date}
            onSelect={(newDate) => setDate(newDate as Date)}
            numberOfMonths={1}
            disabled={disabled}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}

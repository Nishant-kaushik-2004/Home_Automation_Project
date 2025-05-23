"use client";

import * as React from "react";
import { CalendarIcon } from "@radix-ui/react-icons";
import { addDays, format } from "date-fns";
// import { DateRange } from "react-day-picker";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export function DatePickerWithRange({ className, handleDateRange }) {
  const [date, setDate] = React.useState({
    from: new Date(Date.now()-7*24*60*60*1000),
    to: addDays(new Date(Date.now()-7*24*60*60*1000), 7),
  });
  React.useEffect(() => {
    handleDateRange(date);
  }, [date,handleDateRange]);
  return (
    <div className={cn("grid gap-2", className) }>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"default"}
            className={cn(
              "w-[300px] justify-start text-left font-normal hover:scale-105 transition-all shadow-md",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} -{" "}
                  {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 sm:h-80" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={setDate}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}

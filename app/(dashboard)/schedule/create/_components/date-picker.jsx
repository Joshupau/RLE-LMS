"use client"

import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"


export function DatePickerWithRange({
    className,
    onSelectDateRange,
  }) {
    const [dateRanges, setDateRanges] = React.useState([]);
  
    const addDateRange = () => {
      setDateRanges([...dateRanges, { from: null, to: null }]);
    };
  
    return (
      <div className={cn("grid gap-2", className)}>
        {dateRanges.map((dateRange, index) => (
          <DatePickerWithRangeItem
            key={index}
            dates={dateRange}
            onSelect={(newRange) => {
              const updatedRanges = [...dateRanges];
              updatedRanges[index] = newRange;
              setDateRanges(updatedRanges);
              onSelectDateRange(updatedRanges); 
            }}
            onClose={() => {
              const updatedRanges = dateRanges.filter((_, i) => i !== index);
              setDateRanges(updatedRanges);
              onSelectDateRange(updatedRanges); 
            }}
            value={dateRange}
          />
        ))}
  
        <Button variant="outline" onClick={addDateRange}>
          Add Date Range
        </Button>
      </div>
    );
  }
// ...

function DatePickerWithRangeItem({ dates, onSelect, onClose, dateRange }) {
    return (
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-[300px] justify-start text-left font-normal",
              !dates && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {dates?.from ? (
            dates.to ? (
              <>
                {format(dates.from, "LLL dd, y")} -{" "}
                {format(dates.to, "LLL dd, y")}
              </>
            ) : (
              format(dates.from, "LLL dd, y")
            )
          ) : (
            <span>Pick a date</span>
          )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-4" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={dates?.from}
            selected={dates}
            onSelect={onSelect}
            numberOfMonths={2}
            value={dateRange}
          />
          <div className="mt-4">
            <Button variant="outline" onClick={onClose}>
              Remove Date Range
            </Button>
            
          </div>
        </PopoverContent>
      </Popover>
    );
  }
  
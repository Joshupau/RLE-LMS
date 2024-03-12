
import { Calendar as CalendarIcon } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"

import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
  } from "@/components/ui/popover"
  import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
  import { Input } from "@/components/ui/input"

  import { useState } from "react"

export const MedicalCaseField = () => {
    const [date, setDate] = useState();

    return (
        <>
        <div className="flex flex-col space-y-2 justify-end">
            <Input
              type="text"
              placeholder="Name of Patient"
              />
          </div>
          <div className="flex flex-col space-y-2 justify-end">
            <Input
              type="number"
              placeholder="Age"
              />
          </div>
          <div className="flex flex-col space-y-2 justify-end">
          <Select>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Marital Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Marital Status</SelectLabel>
                <SelectItem value="Single">Single</SelectItem>
                <SelectItem value="Married">Married</SelectItem>
                <SelectItem value="Widowed">Widowed</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          </div>
          <div className="flex flex-col space-y-2 justify-end">
          <Select>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Sex" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Sex</SelectLabel>
                <SelectItem value="Male">Male</SelectItem>
                <SelectItem value="Female">Female</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          </div>
          <div className="flex flex-col space-y-2 justify-end">
            <Input
              type="text"
              placeholder="Attending Physician"
              />
          </div>
          <div className="flex flex-col space-y-2 justify-end">
            <Input
              type="text"
              placeholder="Medical Diagnosis"
              />
          </div>
          <div className="flex flex-col space-y-2 justify-end">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-[280px] justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                  )}
                  >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : <span>Date Admitted</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
                />
            </PopoverContent>
          </Popover>
          </div>
          <div className="flex flex-col space-y-2 justify-end">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-[280px] justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                  )}
                  >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : <span>Date Discharged</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
                />
            </PopoverContent>
          </Popover>
          </div>
        
        </>
    )
}
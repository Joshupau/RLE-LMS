"use client"

import { Check, ChevronsUpDown, Calendar as CalendarIcon } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Separator } from "@/components/ui/separator"

import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { Input } from "@/components/ui/input"

import { useState } from "react"

import { MedicalCaseField } from "./medical-case-field"
import { DRMAField } from "./DRMA-field"
import { DRCordCareField } from "./DRCord"

const Cases = [
  {
    value: "Medical",
    label: "Medical",
  },
  {
    value: "Pediatrics",
    label: "Pediatrics",
  },
  {
    value: "Communicable Diseases",
    label: "Communicable Diseases",
  },
  {
    value: "Obstetrics",
    label: "Obstetrics",
  },
  {
    value: "Surgical",
    label: "Surgical",
  },
  {
    value: "Medical Surgical Intensive",
    label: "Medical Surgical Intensive",
  },
  {
    value: "Orthopedics",
    label: "Orthopedics",
  },
  {
    value: "Gynecology",
    label: "Gynecology",
  },
  {
    value: "EENT",
    label: "EENT",
  },
  {
    value: "Nursery",
    label: "Nursery",
  },
  {
    value: "Psychiatric",
    label: "Psychiatric",
  },
  {
    value: "OR Major",
    label: "OR Major",
  },
  {
    value: "OR Minor",
    label: "OR Minor",
  },
  {
    value: "DR Manage",
    label: "DR Manage",
  },
  {
    value: "DR Assist",
    label: "DR Assist",
  },
  {
    value: "DR Cord Care",
    label: "DR Cord Care",
  },
  {
    value: "CHN",
    label: "CHN",
  },
];
const allowedValues = new Set([
  'Medical',
  'Pediatrics',
  'Communicable Diseases',
  'Obstetrics',
  'Surgical',
  'Medical Surgical Intensive',
  'Orthopedics',
  'Gynecology',
  'EENT',
  'Nursery',
  'Psychiatric',
]);
const ORValues = new Set([
  'OR Major',
  'OR Minor',
]);
const DRMAValues = new Set([
  'DR Manage',
  'DR Assist',
])

export const PatientCaseSubmission = () => {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState();
  const [value, setValue] = useState("");

  const [patientCount, setPatientCount] = useState(1); 
  const [patientInfos, setPatientInfos] = useState({
    names: [],
    relationToHeads: [],
    birthdays: [],
    sexes: [],
    maritalStatuses: [],
    educations: [],
    occupations: [],
  });
  const patientInfo = patientInfos[patientCount - 1];


  return (
    
  <Popover>
    <div>
     <form >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col space-y-2 justify-end">
            <PopoverTrigger className="min-w-full" asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="w-[200px] justify-between"
                >
                {value
                  ? Cases.find((Case) => Case.value === value)?.label
                  : "Select Case..."}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="min-w-full p-0">
              <Command>
                <CommandList>
                <CommandInput placeholder="Search Case..." />
                <CommandEmpty>No Case found.</CommandEmpty>
                <CommandGroup>
                  {Cases.map((Case) => (
                    <CommandItem
                    key={Case.value}
                    value={Case.value}
                    onSelect={(currentValue) => {
                      setValue(currentValue === value ? "" : currentValue)
                      setOpen(false)
                    }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          value === Case.value ? "opacity-100" : "opacity-0"
                          )}
                          />
                      {Case.label}
                    </CommandItem>
                  ))}
                </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </div>
          <div className="flex flex-col space-y-2 justify-end">
            <Input
              type="number"
              placeholder="Case Number"
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
                {date ? format(date, "PPP") : <span>Date</span>}
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
          <Select>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Level" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Level</SelectLabel>
                <SelectItem value="1">I</SelectItem>
                <SelectItem value="2">II</SelectItem>
                <SelectItem value="3">III</SelectItem>
                <SelectItem value="4">IV</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          </div>
          {allowedValues.has(value) && (
          <>
          <MedicalCaseField/>
            </>
          )}
          {DRMAValues.has(value) && (
            <>
          <DRMAField/>
            </>
          )}
          {value === 'DR Cord Care' && (
            <>
           <DRCordCareField/>   
            </>
          )}
        </div>
          {value === 'CHN' && (
            <>
            <Tabs className="pt-2" defaultValue="1">
              <TabsList>
            {Array(patientCount).fill(null).map((_, index) => (
              <TabsTrigger key={index} value={index}>Patient{index + 1}</TabsTrigger>
              ))}
              </TabsList>
              <Button variant="ghost" type="button" onClick={() => setPatientCount(patientCount + 1)}>Add Patient</Button>

              {Array(patientCount).fill(null).map((_, index) => (
                <TabsContent value={index}>
                    <h1 className="text-2xl font-medium">Patient {index + 1} Information</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col space-y-2 justify-end">
                  <Input type="text" name="name" placeholder="Name" onChange={(e) => handleNameChange(e.target.value, index)} />
                </div>
                <div className="flex flex-col space-y-2 justify-end">
                    <Input type="text" name="relationToHead" placeholder="Relation to Head"/>
                </div>
                <div className="flex flex-col space-y-2 justify-end">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-[280px] justify-start text-left font-normal",
                            !patientInfos.birthdays && "text-muted-foreground"
                            )}
                            >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {date ? format(date, "PPP") : <span>Birthday</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={patientInfos.birthdays}
                          onSelect={setDate}
                          initialFocus
                          />
                      </PopoverContent>
                    </Popover>
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
              <Input type="text" name="education" placeholder="Highest Educational Attainment"  />
            </div>
            <div className="flex flex-col space-y-2 justify-end">
              <Input type="text" name="occupation" placeholder="Occupation/Workplace" />
            </div>
          </div>           
          </TabsContent>
          ))}
      </Tabs>
            </>
            )}  
            <div className="flex m-1 justify-end">
          <Button type="submit">Submit your Patient Case</Button>
        </div>
      </form>
    </div>
    </Popover>     

  )
}


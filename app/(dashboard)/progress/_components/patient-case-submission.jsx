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
import { DialogClose } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"

import { useState } from "react"
import { useToast } from "@/components/ui/use-toast"

import { useRouter } from "next/navigation";

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
const DRMAValues = new Set([
  'DR Manage',
  'DR Assist',
]);
const ORM = new Set([
  'OR Major',
  'OR Minor',
]);


export const PatientCaseSubmission = ({userId, schedules, yearLevel}) => {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState();
  const [dateAdmitted, setDateAdmitted] = useState();
  const [dateDischarged, setDateDischarged] = useState();
  const [dateDelivered, setDateDelivered] = useState();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();
  const { toast } = useToast();

  const [value, setValue] = useState("");
  
  const [commonInfo, setCommonInfo] = useState({
    caseNumber: "",
    level: yearLevel.toString(),
    scheduleId: "",
  })
  const [surgeonCount, setSurgeonCount] = useState(1); 
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
  const [medicalCaseInfo, setMedicalCaseInfo] = useState({
    PatientName: "",
    Age: "",
    MaritalStatus: "",
    Sex: "",
    Physician: "",
    Diagnosis: "",
  });
  const [DRMACaseInfo, setDRMACaseInfo] = useState({
    PatientName: "",
    Age: "",
    Diagnosis: "",
    DeliveryTime: "",
    DeliveryType: "",
    Agency: "",
  });
  const [ORCaseInfo, setORCaseInfo] = useState({
    PatientName: "",
    Age: "",
    Sex: "",
    Diagnosis: "",
    Operation: "",
    typeOfAnesthesia: "",
    Anesthesiologist: "",
    Scrub: "",
  })
  const [ORSurgeon, setORSurgeon] = useState([]);
  const [DRCordCare, setDRCordCare] = useState({
    BabyName: "",
    Sex: "",
    APGARScore: "",
    MotherName: "",
    Age: "",
    Staff: "",
    Agency: "",
  });

  const handleMaritalStatusChange = (status, index) => {
    const updatedMaritalStatuses = [...patientInfos.maritalStatuses];
    updatedMaritalStatuses[index] = status; 
    setPatientInfos({...patientInfos, maritalStatuses: updatedMaritalStatuses}); 
  };
  const handleSexChange = (sex, index) => {
    const updatedSexes = [...patientInfos.sexes]; 
    updatedSexes[index] = sex;
    setPatientInfos({...patientInfos, sexes: updatedSexes}); 
  };
  const removeSurgeon = (indexToRemove) => {
    const updatedSurgeons = [...ORSurgeon];
    updatedSurgeons.splice(indexToRemove, 1);
    setSurgeonCount(surgeonCount - 1);
    setORSurgeon(updatedSurgeons);
    console.log(ORSurgeon);
  };
  
  
  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      if(allowedValues.has(value))
      {
        const MedCaseData = {
          scheduleId: commonInfo.scheduleId,
          caseType: value,
          caseNumber: parseInt(commonInfo.caseNumber),
          level: commonInfo.level,
          date: date,
          patientName: medicalCaseInfo.PatientName,
          age: parseInt(medicalCaseInfo.Age),
          maritalStatus: medicalCaseInfo.MaritalStatus,
          sex: medicalCaseInfo.Sex,
          attendingPhysician: medicalCaseInfo.Physician,
          medicalDiagnosis: medicalCaseInfo.Diagnosis,
          dateAdmitted: dateAdmitted,
          dateDischarged: dateDischarged,
          userId,
        }
  
        const response = await fetch('/api/progress/case/medical', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(MedCaseData),
        });
    
        if (response.ok) {
          console.log('Successfully Submitted Medical Case!');
          toast({
            title: "Success",
            description: "Patient case submitted successfully",
            status: "success",
          });
        } else {
          console.error('Failed to Submit Medical Case :<');
          toast({
            title: "Failed",
            description: "Failed to submit case successfully",
            variant: "destructive"
          });
        }

      } else if(value==='DR Cord Care')
      {
        const DRCordCaseData = {
          scheduleId: commonInfo.scheduleId,
          caseType: value,
          caseNumber: parseInt(commonInfo.caseNumber),
          level: commonInfo.level,
          babyName: DRCordCare.BabyName,
          sex: DRCordCare.Sex,
          apgarScore: parseInt(DRCordCare.APGARScore),
          motherName: DRCordCare.MotherName,
          motherAge: parseInt(DRCordCare.Age),
          staff: DRCordCare.Staff,
          birthplace: DRCordCare.Agency,
          date: date,
          userId,
        }
          
        const response = await fetch('/api/progress/case/DRCord', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(DRCordCaseData),
        });
    
        if (response.ok) {
          console.log('Successfully Submitted DR Cord Case!');
          toast({
            title: "Success",
            description: "DR Cord case submitted successfully",
            status: "success",
          });
        } else {
          console.error('Failed to Submit DR Cord Case :<');
          toast({
            title: "Failed",
            description: "Failed to submit case successfully",
            variant: "destructive"
          });
        }
      } else if(DRMAValues.has(value)) {
        const DRMACase = {
          scheduleId: commonInfo.scheduleId,
          date: date,
          caseType: value,
          caseNumber: parseInt(commonInfo.caseNumber),
          level: commonInfo.level,
          patientName: DRMACaseInfo.PatientName,
          age: parseInt(DRMACaseInfo.Age),
          medicalDiagnosis: DRMACaseInfo.Diagnosis,
          dateOfDelivery: dateDelivered,
          timeOfDelivery: DRMACaseInfo.DeliveryTime,
          typeOfDelivery: DRMACaseInfo.DeliveryType,
          birthplace: DRMACaseInfo.Agency,
          userId,
        }

        const response = await fetch('/api/progress/case/DRMA', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(DRMACase),
        });
    
        if (response.ok) {
          console.log('Successfully Submitted DR MA Case!');
          toast({
            title: "Success",
            description: "DR Major/Assist case submitted successfully",
            status: "success",
          });
        } else {
          console.error('Failed to Submit DR MA Case :<');
          toast({
            title: "Failed",
            description: "Failed to submit case successfully",
            variant: "destructive"
          });
        }

      } else if(ORM.has(value)){
        const ORCase = {
          scheduleId: commonInfo.scheduleId,
          caseType: value,
          caseNumber: parseInt(commonInfo.caseNumber),
          level: commonInfo.level,
          patientName: ORCaseInfo.PatientName,
          age: parseInt(ORCaseInfo.Age),
          sex: ORCaseInfo.Sex,
          medicalDiagnosis: ORCaseInfo.Diagnosis,
          operation: ORCaseInfo.Operation,
          surgeon: ORSurgeon,
          typeOfAnesthesia: ORCaseInfo.typeOfAnesthesia,
          anesthesiologist: ORCaseInfo.Anesthesiologist,
          scrub: ORCaseInfo.Scrub,
          date: date,
          userId,
        }
        const response = await fetch('/api/progress/case/OR', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(ORCase),
        });
    
        if (response.ok) {
          console.log('Successfully Submitted OR Major/Minor Case!');
          toast({
            title: "Success",
            description: `${value} case submitted successfully`,
            status: "success",
          });
        } else {
          console.error(`Failed to Submit ${value} Case :<`);
          toast({
            title: "Failed",
            description: "Failed to submit case successfully",
            variant: "destructive"
          });
        }
      } else if(value === 'CHN'){
        const dates = patientInfos.birthdays.map(birthday => new Date(birthday));

        const CHNCase = {
          scheduleId: commonInfo.scheduleId,
          caseType: value,
          caseNumber: parseInt(commonInfo.caseNumber),
          level: commonInfo.level,
          nameOfFamilyMembers: patientInfos.names,
          relationToHead: patientInfos.relationToHeads,
          birthday: dates,
          sex: patientInfos.sexes,
          maritalStatus: patientInfos.maritalStatuses,
          educationalAttainment: patientInfos.educations,
          occupation: patientInfos.occupations,
          date: date, 
          userId,
        }
        const response = await fetch('/api/progress/case/CHN', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(CHNCase),
        });
    
        if (response.ok) {
          console.log('Successfully Submitted CHN Case!');
          toast({
            title: "Success",
            description: `${value} case submitted successfully`,
            status: "success",
          });
        } else {
          console.error(`Failed to Submit ${value} Case :<`);
          toast({
            title: "Failed",
            description: "Failed to submit case successfully",
            variant: "destructive"
          });
        }
      }else {
        console.log("Invalid Case Type");
        toast({
          title: "Invalid",
          description: "Invalid Case Type",
          variant: "destructive"
        });
      }
      setIsSubmitting(false);
      router.refresh();

    } catch (error) {
      console.log(error);
      setIsSubmitting(false);
      router.refresh();
      toast({
        title: "Error",
        description: "Uh oh! something went wrong...",
        variant: "destructive"
      }); 
    }
  }


  return (
    
  <Popover>
    <div>
        <div className="flex my-2 flex-col space-y-2 justify-end">
        <Select onValueChange={(e)=>setCommonInfo({...commonInfo, scheduleId: e})} required>
        <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Week" />
            </SelectTrigger>
          <SelectContent>
            <SelectGroup>
          {schedules.map((schedule, index) => (
            <SelectItem key={index} value={schedule.id}>
              {schedule.week}
            </SelectItem>
          ))}
          </SelectGroup>
          </SelectContent>
        </Select>            
          </div>
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
            <PopoverContent className="min-w-full p-0 overflow-y-scroll max-h-screen">
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
              onChange={(e)=>{setCommonInfo({...commonInfo, caseNumber: e.target.value})}}
              required
              />
          </div>
          <div className="flex flex-col space-y-2 justify-end">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "min-w-full justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                  )}
                  >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : <span>Date of Case Acquired</span>}
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
          <Select defaultValue={commonInfo.level} disabled >
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
        <div className="flex flex-col space-y-2 justify-end">
            <Input
              type="text"
              placeholder="Name of Patient"
              value={medicalCaseInfo.PatientName}
              onChange={(e)=>setMedicalCaseInfo({...medicalCaseInfo, PatientName: e.target.value})}
              required />
          </div>
          <div className="flex flex-col space-y-2 justify-end">
            <Input
              type="number"
              placeholder="Age"
              value={medicalCaseInfo.Age}
              onChange={(e)=>setMedicalCaseInfo({...medicalCaseInfo, Age: e.target.value})}
              required/>
          </div>
          <div className="flex flex-col space-y-2 justify-end">
          <Select defaultValue={medicalCaseInfo.MaritalStatus} onValueChange={(value)=>setMedicalCaseInfo({...medicalCaseInfo, MaritalStatus: value})} required>
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
          <Select defaultValue={medicalCaseInfo.Sex} onValueChange={(value)=>setMedicalCaseInfo({...medicalCaseInfo, Sex: value})} required>
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
              value={medicalCaseInfo.Physician}
              onChange={(e)=>setMedicalCaseInfo({...medicalCaseInfo, Physician: e.target.value})}              
              required/>
          </div>
          <div className="flex flex-col space-y-2 justify-end">
            <Input
              type="text"
              placeholder="Medical Diagnosis"
              value={medicalCaseInfo.Diagnosis}
              onChange={(e)=>setMedicalCaseInfo({...medicalCaseInfo, Diagnosis: e.target.value})}
              required/>
          </div>
          <div className="flex flex-col space-y-2 justify-end">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "min-w-full justify-start text-left font-normal",
                  !dateAdmitted && "text-muted-foreground"
                  )}
                  >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateAdmitted ? format(dateAdmitted, "PPP") : <span>Date Admitted</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={dateAdmitted}
                onSelect={setDateAdmitted}
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
                  "min-w-full justify-start text-left font-normal",
                  !dateDischarged && "text-muted-foreground"
                  )}
                  >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateDischarged ? format(dateDischarged, "PPP") : <span>Date Discharged</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={dateDischarged}
                onSelect={setDateDischarged}
                initialFocus
                />
            </PopoverContent>
          </Popover>
          </div>
                      </>
          )}
          {DRMAValues.has(value) && (
            <>
        <div className="flex flex-col space-y-2 justify-end">
            <Input
              type="text"
              placeholder="Name of Patient"
              value={DRMACaseInfo.PatientName}
              onChange={(e)=>setDRMACaseInfo({...DRMACaseInfo, PatientName: e.target.value})}
              required />
          </div>
          <div className="flex flex-col space-y-2 justify-end">
            <Input
              type="number"
              placeholder="Age"
              value={DRMACaseInfo.Age}
              onChange={(e)=>setDRMACaseInfo({...DRMACaseInfo, Age: e.target.value})}
              required/>
          </div>
          <div className="flex flex-col space-y-2 justify-end">
            <Input
              type="text"
              placeholder="Medical Diagnosis"
              value={DRMACaseInfo.Diagnosis}
              onChange={(e)=>setDRMACaseInfo({...DRMACaseInfo, Diagnosis: e.target.value})}
              required/>
          </div>
          <div className="flex flex-col space-y-2 justify-end">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "min-w-full justify-start text-left font-normal",
                  !dateDelivered && "text-muted-foreground"
                  )}
                  >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateDelivered ? format(dateDelivered, "PPP") : <span>Date of Delivery</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={dateDelivered}
                onSelect={setDateDelivered}
                initialFocus
                />
            </PopoverContent>
          </Popover>
          </div>
          <div className="flex flex-col space-y-2 justify-end">
            <Input
              type="time"
              placeholder="Time of Delivery"
              value={DRMACaseInfo.DeliveryTime}
              onChange={(e)=>setDRMACaseInfo({...DRMACaseInfo, DeliveryTime: e.target.value})}
              required/>
          </div>
          <div className="flex flex-col space-y-2 justify-end">
            <Input
              type="text"
              placeholder="Type of Delivery"
              value={DRMACaseInfo.DeliveryType}
              onChange={(e)=>setDRMACaseInfo({...DRMACaseInfo, DeliveryType: e.target.value})}
              required/>
          </div>            
          <div className="flex flex-col space-y-2 justify-end">
            <Input
              type="text"
              placeholder="Name of Hospital/Agency"
              value={DRMACaseInfo.Agency}
              onChange={(e)=>setDRMACaseInfo({...DRMACaseInfo, Agency: e.target.value})}
              required/>
          </div> 
                      </>
          )}
          {value === 'DR Cord Care' && (
            <>
          <div className="flex flex-col space-y-2 justify-end">
            <Input
              type="text"
              placeholder="Name of Baby"
              value={DRCordCare.BabyName}
              onChange={(e)=>setDRCordCare({...DRCordCare, BabyName: e.target.value})}
              required/>
          </div>
          <div className="flex flex-col space-y-2 justify-end">
          <Select defaultValue={DRCordCare.Sex} onValueChange={(e)=>setDRCordCare({...DRCordCare, Sex: e})} required>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Sex" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Sex(Baby)</SelectLabel>
                <SelectItem value="Male">Male</SelectItem>
                <SelectItem value="Female">Female</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          </div>
          <div className="flex flex-col space-y-2 justify-end">
            <Input
              type="number"
              placeholder="APGAR Score"
              value={DRCordCare.APGARScore}
              onChange={(e)=>setDRCordCare({...DRCordCare, APGARScore: e.target.value})}
              required/>
          </div>
          <div className="flex flex-col space-y-2 justify-end">
            <Input
              type="text"
              placeholder="Name of Mother"
              value={DRCordCare.MotherName}
              onChange={(e)=>setDRCordCare({...DRCordCare, MotherName: e.target.value})}
              required />
          </div> 
          <div className="flex flex-col space-y-2 justify-end">
            <Input
              type="number"
              placeholder="Age"
              value={DRCordCare.Age}
              onChange={(e)=>setDRCordCare({...DRCordCare, Age: e.target.value})}
              required />
          </div> 
          <div className="flex flex-col space-y-2 justify-end">
            <Input
              type="text"
              placeholder="Staff on Duty"
              value={DRCordCare.Staff}
              onChange={(e)=>setDRCordCare({...DRCordCare, Staff: e.target.value})}
              />
          </div> 
          <div className="flex flex-col space-y-2 justify-end">
            <Input
              type="text"
              placeholder="Name of Hospital/Agency"
              value={DRCordCare.Agency}
              onChange={(e)=>setDRCordCare({...DRCordCare, Agency: e.target.value})}
              required />
          </div>
                      </>
          )}
        {ORM.has(value) && (
          <>
            <div className="flex flex-col space-y-2 justify-end">
            <Input
              type="text"
              placeholder="Name of Patient"
              value={ORCaseInfo.PatientName}
              onChange={(e)=>setORCaseInfo({...ORCaseInfo, PatientName: e.target.value})}
              required
              />
          </div>
          <div className="flex flex-col space-y-2 justify-end">
            <Input
              type="number"
              placeholder="Age"
              value={ORCaseInfo.Age}
              onChange={(e)=>setORCaseInfo({...ORCaseInfo, Age: e.target.value})}
              required
              />
          </div>
          <div className="flex flex-col space-y-2 justify-end">
          <Select defaultValue={ORCaseInfo.Sex} onValueChange={(value)=>setORCaseInfo({...ORCaseInfo, Sex: value})} required>
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
              placeholder="Medical Diagnosis"
              value={ORCaseInfo.Diagnosis}
              onChange={(e)=>setORCaseInfo({...ORCaseInfo, Diagnosis: e.target.value})}
              required
              />
          </div>
          <div className="flex flex-col space-y-2 justify-end">
            <Input
              type="text"
              placeholder="Operation"
              value={ORCaseInfo.Operation}
              onChange={(e)=>setORCaseInfo({...ORCaseInfo, Operation: e.target.value})}
              required
              />
          </div>
          
          {Array(surgeonCount).fill(null).map((_, index) => (
            <>
             <div key={index} className="relative flex items-center">
            <Input
              type="text"
              placeholder="Surgeon/Assistant Surgeon"
              value={ORSurgeon[index] || ''}
              onChange={(e)=> {
                const updatedORSurgeon = [...ORSurgeon]; 
                updatedORSurgeon[index] = e.target.value; 
                setORSurgeon(updatedORSurgeon);
              }}               
              required/>
                                {/* value={patientInfos.names[index] || ''}
                  onChange={(e)=> {
                    const updatedNames = [...patientInfos.names]; // Create a copy of the array
                    updatedNames[index] = e.target.value; // Update the value at index 1
                    setPatientInfos({...patientInfos, names: updatedNames});
                  }}  */}
            {(index === 0) && ( // Render the Add button only if index is 0 (first div)
              <Button variant="ghost" type="button" onClick={() => setSurgeonCount(surgeonCount + 1)}>
                +
              </Button>
            )}
            {(index > 0) && ( // Render the Remove button after the first index
              <Button variant="ghost" type="button" onClick={() => removeSurgeon(index)}>
                -
              </Button>
            )}          
            </div>

             </>
          ))}
          <div className="flex flex-col space-y-2 justify-end">
            <Input
              type="text"
              placeholder="Type of Anesthesia"
              value={ORCaseInfo.typeOfAnesthesia}
              onChange={(e)=>setORCaseInfo({...ORCaseInfo, typeOfAnesthesia: e.target.value})}
              required/>
          </div>
          <div className="flex flex-col space-y-2 justify-end">
            <Input
              type="text"
              placeholder="Anesthesiologist"
              value={ORCaseInfo.Anesthesiologist}
              onChange={(e)=>setORCaseInfo({...ORCaseInfo, Anesthesiologist: e.target.value})}
              required/>
          </div>
          <div className="flex flex-col space-y-2 justify-end">
            <Input
              type="text"
              placeholder="Scrub/Circulating Nurse"
              value={ORCaseInfo.Scrub}
              onChange={(e)=>setORCaseInfo({...ORCaseInfo, Scrub: e.target.value})}
              required/>
          </div>
          

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
                  <Input type="text" name="name" placeholder="Name e.g J.D.C" 
                  value={patientInfos.names[index] || ''}
                  onChange={(e)=> {
                    const updatedNames = [...patientInfos.names]; // Create a copy of the array
                    updatedNames[index] = e.target.value; // Update the value at index 1
                    setPatientInfos({...patientInfos, names: updatedNames});
                  }} 
                  required/>
                </div>
                <div className="flex flex-col space-y-2 justify-end">
                <Input 
                  type="text" 
                  name="relationToHead" 
                  placeholder="Relation to Head" 
                  value={patientInfos.relationToHeads[index] || ''}
                  onChange={(e)=> {
                    const updatedRelationToHeads = [...patientInfos.relationToHeads]; // Create a copy of the array
                    updatedRelationToHeads[index] = e.target.value; // Update the value at index 1
                    setPatientInfos({...patientInfos, relationToHeads: updatedRelationToHeads});
                  }} 
                  required/>
                </div>
                <div className="flex flex-col space-y-2 justify-end">
                  <Input type="date" name="occupation" placeholder="Occupation/Workplace" 
                    value={patientInfos.birthdays[index] || ''}
                    onChange={(e)=> {
                      const updatedbirthdays = [...patientInfos.birthdays]; // Create a copy of the array
                      updatedbirthdays[index] = e.target.value; // Update the value at index 1
                      setPatientInfos({...patientInfos, birthdays: updatedbirthdays});
                    }} required/>
                  </div>
              <div className="flex flex-col space-y-2 justify-end">
              <Select defaultValue={patientInfos.maritalStatuses[index]}  onValueChange={(value)=>handleMaritalStatusChange(value, index)} required>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Marital Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Marital Status</SelectLabel>
                    <SelectItem value="Single" >Single</SelectItem>
                    <SelectItem value="Married" >Married</SelectItem>
                    <SelectItem value="Widowed" >Widowed</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              </div>
              <div className="flex flex-col space-y-2 justify-end">
              <Select defaultValue={patientInfos.sexes[index]} onValueChange={(value) => handleSexChange(value, index)} required>
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
              <Input type="text" name="education" placeholder="Highest Educational Attainment"
                  value={patientInfos.educations[index] || ''}
                  onChange={(e)=> {
                    const updatedEducation = [...patientInfos.educations]; // Create a copy of the array
                    updatedEducation[index] = e.target.value; // Update the value at index 1
                    setPatientInfos({...patientInfos, educations: updatedEducation});
                  }}               
                  required/>
            </div>
            <div className="flex flex-col space-y-2 justify-end">
              <Input type="text" name="occupation" placeholder="Occupation/Workplace" 
                  value={patientInfos.occupations[index] || ''}
                  onChange={(e)=> {
                    const updatedoccupations = [...patientInfos.occupations]; // Create a copy of the array
                    updatedoccupations[index] = e.target.value; // Update the value at index 1
                    setPatientInfos({...patientInfos, occupations: updatedoccupations});
                  }} 
                  required/>
            </div>
            
          </div>           
          </TabsContent>
          ))}
      </Tabs>
            </>
            )}  
            <div className="flex m-1 justify-end">
              <DialogClose>
          <Button disabled={isSubmitting} type="submit" onClick={handleSubmit}>Submit your Patient Case</Button>
              </DialogClose>
        </div>
    </div>
    </Popover>     

  )
}


'use client'

import { useEffect, useState } from "react";
import { StudentList } from "./student-list";
import { ClinicalInstructorSelect } from "./clinical-instructor";
import { DatePickerWithRange } from "./date-picker";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { Plus } from 'lucide-react';
import { 
  Select,
  SelectContent,
  SelectTrigger,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
  DialogFooter,
} from "@/components/ui/dialog"
  
  import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

export const CreateSchedule = ({
 students,
 userId,
 clinicalInstructor,
 areas
}) => {
  const { toast } = useToast();

    const [selectedGroup, setSelectedGroup] = useState(""); // Store selected group
    const [selectedYearLevel, setSelectedYearLevel] = useState(""); // Store selected year level
  
    const [selectedDateRange, setSelectedDateRange] = useState([]);
    const [selectedStudents, setSelectedStudents] = useState([]);
    const [selectedInstructor, setSelectedInstructor] = useState(null);
    const [week, setSelectedWeek] = useState("");

    const [selectedArea, setSelectedArea] = useState();
    const [selectedHour, setSelectedHour] = useState();

    const [isSubmitting, setIsSubmitting] = useState(false);

    const [createArea, SetCreateArea] = useState("");
  
    const router = useRouter();
  
    const handleYearLevelChange = (event) => {
      setSelectedYearLevel(Number(event));
    };
    const handleWeekChange = (event) => {
      setSelectedWeek(event.target.value);

    };
  
    function getDatesInRanges(startDates, endDates) {
      const dates = [];
    
      for (let i = 0; i < startDates.length; i++) {
        let startDate = new Date(startDates[i]);
        let endDate = new Date(endDates[i]); 
    
        while (startDate <= endDate) {
          dates.push(new Date(startDate));
          startDate.setDate(startDate.getDate() + 1); 
        }
      }
    
      return dates;
    }

  
    const handleEnterSchedule = async () => {
      try {
          setIsSubmitting(true);

          if (
              !selectedInstructor ||
              !selectedHour ||
              !selectedArea ||
              !selectedDateRange ||
              !userId ||
              !selectedGroup ||
              !selectedYearLevel ||
              !week
          ) {
              toast({
                  title: "Incomplete Fields",
                  description: "Please complete all input fields.",
                  status: "Destructive"
              });
              return;
          }
          if (!selectedStudents.length > 0) {
            toast({
                title: "Incomplete Fields",
                description: "Please select students from the list.",
                status: "Destructive"
            });
            return;
        }

  
          const formattedDates = selectedDateRange.map(({ from, to }) => ({
              from: new Date(from),
              to: new Date(to),
          }));
  
          const DatesofDuty = getDatesInRanges(
              formattedDates.map((date) => date.from),
              formattedDates.map((date) => date.to)
          );
  
          const data = {
              clinicalInstructor: selectedInstructor.id,
              clinicalHours: selectedHour,
              area: selectedArea,
              dateFrom: formattedDates.map((date) => date.from),
              dateTo: formattedDates.map((date) => date.to),
              userId,
              group: selectedGroup,
              yearLevel: selectedYearLevel,
              students: selectedStudents,
              week,
              dates: DatesofDuty,
          };
  
          const response = await fetch('/api/schedule', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify(data),
          });
  
          if (response.ok) {
              router.push('/schedule');
          } else {
              console.error('Failed to create schedule');
              toast({
                  title: "Failed",
                  description: "Failed to create schedule.",
                  status: "Destructive"
              });
          }
      } catch (error) {
          console.error('Error creating schedule:', error);
          toast({
              title: "Error",
              description: "An error occurred while creating schedule.",
              status: "Destructive"
          });
      } finally {
          setIsSubmitting(false); 
      }
  };
  

    const handleAddArea = async () => {
      try {
        const response = await fetch('/api/schedule/area', {
          method: "POST",
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ createArea })
        });
        toast({
          title: "Success",
          description: "Successfully added a new clinical area.",
          status: "Success"
        });
        if(response.ok){
          toast({
            title: "Success",
            description: "Successfully added a new clinical area.",
            status: "Success"
          });
        } else {
          toast({
            title: "Uh oh...",
            description: "Failed to add new clinical area.",
            status: "Failed"
          });
        }

      } catch (error) {
        console.error('Error adding area:', error); 
        toast({
          title: "Uh oh...",
          description: "Failed to add new clinical area.",
          status: "Failed"
        });
      }
    }

    return (
        <>
          <div className="p-6 mt-16">
            <div className="flex items-center justify-between">
            <div className="flex flex-col gap-y-2">
                <h1 className="text-2xl font-medium">Schedule Setup</h1>
                <span className="text-sm text-slate-700">Create Schedule</span>
            </div>
            <div>
            <Link className="mx-2" href={'/schedule'}><Button>
                    Return
                    </Button></Link>

                <Button className="bg-green-500 hover:bg-green-600" onClick={handleEnterSchedule} disabled={isSubmitting}>
                    Enter Schedule
                </Button>
            </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
            <div className="flex flex-col w-[20rem]">
            <ClinicalInstructorSelect
                clinicalInstructor={clinicalInstructor}
                onSelectInstructor={(selectedInstructor) => setSelectedInstructor(selectedInstructor)}
                required
            />

            </div>
            <div className="flex flex-col w-[20rem]">
                <Label className="mb-2 text-md" htmlFor="hours">Select Clinical Hour:</Label>
                <Select value={selectedHour} 
                onValueChange={(e) => setSelectedHour(e)} 
                id="hours"
                required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Clinical Hours"/>
                  </SelectTrigger>
                    <SelectContent>
                    <SelectItem value="1">Morning Shift</SelectItem>
                    <SelectItem value="2">Afternoon Shift</SelectItem>
                    <SelectItem value="3">Graveyard Shift</SelectItem>
                    </SelectContent>
                </Select>   
                </div>
                <div className="flex flex-col w-[20rem]">
                  <Label className="mb-2 text-md" htmlFor="area">Select Area:</Label>
                  <div className="flex items-center gap-x-2">
                    <Select 
                    onValueChange={(e) => setSelectedArea(e)}
                     id="area" 
                     className="mr-2 focus-visible:ring-transparent"
                     required
                     >
                      <SelectTrigger>
                        <SelectValue value={selectedArea} placeholder="Clinical Area"/>
                      </SelectTrigger>
                      <SelectContent className="focus-visible:ring-transparent">
                        {areas.map((area) => (
                          <SelectItem key={area.id} value={area.id}>
                            {area?.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Dialog>
                      <DialogTrigger className="border rounded-md hover:bg-slate-100 p-[7px]">
                        <Plus/>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Add Clinical Area</DialogTitle>
                        </DialogHeader>
                        <Input value={createArea} onChange={(e) => SetCreateArea(e.target.value)} placeholder="Clinical Area"/>
                        <DialogFooter>
                            <DialogClose>
                              <Button onClick={handleAddArea}>
                                Submit
                              </Button>
                            </DialogClose>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>     
                </div>
                <div className="flex flex-col w-[20rem]">
                <Label className="mb-2 text-md" htmlFor="date">Date:</Label>
                <DatePickerWithRange
                onSelectDateRange={setSelectedDateRange}
                />
            </div>
              <div className="flex flex-col w-[20rem]">
                <Label className="mb-2 text-md" htmlFor="group">Select Group:</Label>
                <Select id="group" onValueChange={(e) => setSelectedGroup(e)}>
                    <SelectTrigger>
                      <SelectValue value={selectedGroup} placeholder="Group"/>
                    </SelectTrigger>
                    <SelectContent>
                    <SelectItem value="A">Group A</SelectItem>
                    <SelectItem value="B">Group B</SelectItem>
                    </SelectContent>
                </Select>
                </div>
                <div className="flex flex-col w-[20rem]">
                <Label className="mb-2 text-md" htmlFor="yearLevel">Select Year Level:</Label>
                <Select 
                id="yearLevel" 
                onValueChange={(e) => handleYearLevelChange(e)}
                required
                >
                    <SelectTrigger>
                        <SelectValue value={selectedYearLevel} placeholder="Year Level"/>
                    </SelectTrigger>
                    <SelectContent>
                    <SelectItem value="1">1st Year</SelectItem>
                    <SelectItem value="2">2nd Year</SelectItem>
                    <SelectItem value="3">3rd Year</SelectItem>
                    <SelectItem value="4">4th Year</SelectItem>
                    </SelectContent>         
                  </Select>
                </div>
                <div className="flex flex-col w-[20rem]">
                <Label className="mb-2 text-md" htmlFor="week">Week/s:</Label>
                <Input 
                type="text" 
                id="week"
                className="border border-slate-300 rounded-xl p-1" 
                placeholder="e.g 1 or 1-3" 
                onChange={handleWeekChange}
                required
                />
                </div>
            </div>
            <br />
            <br />
                <StudentList
                    selectedGroup={selectedGroup}
                    selectedYearLevel={selectedYearLevel}
                    students={students}
                    onSelectStudents={setSelectedStudents}
                    />
        </div>
        </>
    )
}
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
  
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

const yearLevels = [
  { value: 1, name: "1st Year" },
  { value: 2, name: "2nd Year" },
  { value: 3, name: "3rd Year" },
  { value: 4, name: "4th Year" },
];

export const EditSchedule = ({
    userId,
    student,
    clinicalInstructor,
    areas,
    user,
    groupId,
    yearLevel,
    clinicalArea,
    clinicalHours,
    week,
    id,
    dateFrom,
    dateTo,
    schoolyear,
}) => {

  const { toast } = useToast();
  const router = useRouter();
  
  const [selectedGroup, setSelectedGroup] = useState(""); 
  const [selectedYearLevel, setSelectedYearLevel] = useState(""); 
  const [students, setStudents] = useState([]); 
  const [selectedClinicalHours, setSelectedClinicalHours] = useState("");
  const [selectedDateRange, setSelectedDateRange] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [selectedInstructor, setSelectedInstructor] = useState("");
  const [selectedArea, setSelectedArea] = useState();
  const [selectedWeek, setSelectedWeek] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sanitizedDates, setSanitizedDates] = useState([]);
  const [scheduleId, setScheduleId] = useState("");
  const [createArea, SetCreateArea] = useState("");

  const [selectedDeleteArea, setSelectedDeleteArea] = useState(null);
  const [selectedEditArea, setSelectedEditArea] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedAreaName, setEditedAreaName] = useState('');

  const handleSelectChange = (event) => {
    const areaId = event;
    setSelectedEditArea(areaId);
    const selectedArea = areas.find(area => area.id === areaId);
    setEditedAreaName(selectedArea.name);
    setIsEditing(true);
  };
  
  const handleNameChange = (event) => {
    setEditedAreaName(event.target.value);
  };
  const handleAreaEdit = async () => {
    try {

      if(!editedAreaName){
        toast({
          title: "Uh oh...",
          description: "Please Input a Clinical Area.",
          status: "destructive",
        });
      }

        const response = await fetch(`/api/schedule/area/${selectedEditArea}/update?id=${selectedEditArea}`, {
          method: "POST",
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: selectedEditArea,
            newName: editedAreaName,
          })
        });
        if(!response.ok){
          toast({
            title: "Uh oh...",
            description: "Failed to Edit Clinical Area.",
            status: "destructive",
            variant: "destructive",
          });
        }
        if(response.ok){
          toast({
            title: "Success",
            description: "Successfully Edited Clinical Area.",
            status: "success",
            variant: "success",
          });
          setEditedAreaName('');
        }
        setSelectedEditArea(null);
      
    } catch (error) {
      console.error("Failed to Edit Clinical Area.", error)
      toast({
        title: "Uh oh...",
        description: "Failed to Edit Clinical Area.",
        status: "destructive",
        variant: "destructive",
      });
    } finally {
      setIsEditing(false);
    }
  };
  const handleAreaDelete = async () => {
    try {
      if(!selectedDeleteArea){
        toast({
          title: "Uh oh...",
          description: "No selected Clinical Area to Delete.",
          status: "destructive"
        });
        return;
      }

      const response = await fetch(`/api/schedule/area/${selectedDeleteArea}/delete?id=${selectedDeleteArea}`,{
        method: "DELETE",
      });

      if(!response.ok){
        toast({
          title: "Uh oh...",
          description: "Failed to delete Clinical Area.",
          status: "destructive",
          variant: "destructive",
        });
      }
      if(response.ok){
        toast({
          title: "Success",
          description:  "Successfully deleted the Clinical Area.",
          status: "Success",
          variant: "success"
        });   
      }

    } catch (error) {
      console.error("Failed to delete Clinical Area", error);
      toast({
        title: "Uh oh...",
        description: "Failed to delete Clinical Area.",
        status: "destructive",
        variant: "destructive",
      });
    }
  };
  const previousUsers = user.map(user => user.id);

  const findCI =  user.find(user => user.role === 'ClinicalInstructor');

  
  const handleYearLevelChange = (event) => setSelectedYearLevel(Number(event));
  const handleWeekChange = (event) => setSelectedWeek(event.target.value);
  
  useEffect(() => {
    setSelectedInstructor(findCI);
    setSelectedStudents(user.filter(user => user.role === 'Student').map(user => user.id));
    setSelectedGroup(groupId);
    setSelectedYearLevel(yearLevel);
    setSelectedArea(clinicalArea.id);
    setSelectedClinicalHours(clinicalHours);
    setSelectedWeek(week);
    setScheduleId(id);
    setStudents(student);
    handleSanitizeDate(dateFrom, dateTo);
  }, []);


  const handleSanitizeDate = (dateFrom, dateTo) => {
    if (!Array.isArray(dateFrom) || dateFrom.length === 0 ||
    !Array.isArray(dateTo) || dateTo.length === 0) {
      return;
    }
    
    const sanitizedDates = dateFrom.map((fromStr, index) => {
      const fromDate = new Date(Date.parse(fromStr));
      const toDate = new Date(Date.parse(dateTo[index]));

      return { from: fromDate, to: toDate };
    });
    setSanitizedDates(sanitizedDates);
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
          !selectedClinicalHours ||
          !selectedArea ||
          !selectedDateRange ||
          !userId ||
          !selectedGroup ||
          !selectedYearLevel ||
          !selectedWeek
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
          clinicalInstructor: selectedInstructor,
          clinicalHours: selectedClinicalHours,
          area: selectedArea,
          dateFrom: formattedDates.map((date) => date.from),
          dateTo: formattedDates.map((date) => date.to),
          userId,
          group: selectedGroup,
          yearLevel: selectedYearLevel,
          students: selectedStudents,
          week: selectedWeek,
          scheduleId,
          dates: DatesofDuty,
          previousUsers,
          schoolyear,
        };
        

        const response = await fetch(`/api/schedule/${scheduleId}/update`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });
    
        if (response.ok) {
          toast({
            title: "Success",
            description: "Successfully updated the schedule.",
            status: "success"
          })
          router.push('/schedule');
        } 
      } catch (error) {
        console.error('Error updating schedule:', error);
        toast({
          title: "Uh ohh...",
          description: "Failed to update the schedule.",
          status: "error"
        }) 
        } finally {
        setIsSubmitting(false);
        router.push('/schedule');
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
        if(response.ok){
          toast({
            title: "Success",
            description: "Successfully added a new clinical area.",
            status: "Success",
            variant: "success"
          });
          SetCreateArea('')
        } else {
          toast({
            title: "Uh oh...",
            description: "Failed to add new clinical area.",
            status: "Failed",
            variant: "destructive"
          });
        }

      } catch (error) {
        console.error('Error adding area:', error); 
        toast({
          title: "Uh oh...",
          description: "Failed to add new clinical area.",
          status: "Failed",
          variant: "destructive"
        });
      }
    }

    
    return (
        <>
            <div className="p-6 mt-16 ">
                <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-y-2">
                    <h1 className="text-2xl font-medium">Schedule Edit Setup</h1>
                    <span className="text-sm text-slate-700">Edit Schedule</span>
                    </div>
                    
                    <div>
                    <Dialog>
                            <DialogTrigger className="rounded-md">
                              <Button className="bg-blue-500 hover:bg-blue-700">
                                Clinical Area Actions
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Clinical Area Actions</DialogTitle>
                              </DialogHeader>
                            <Tabs defaultValue="add" className="w-full">
                              <TabsList>
                                <TabsTrigger value="add">Add</TabsTrigger>
                                <TabsTrigger value="edit">Edit</TabsTrigger>
                                <TabsTrigger value="delete">Delete</TabsTrigger>
                              </TabsList>
                              <TabsContent className="mt-2" value="add">
                              <Label>Input Clinical Area & Specialty</Label>
                              <Input value={createArea} onChange={(e) => SetCreateArea(e.target.value)} placeholder="Clinical Area"/>
                              <DialogFooter>
                                  <DialogClose>
                                    <Button className="mt-2" onClick={handleAddArea}>
                                      Submit
                                    </Button>
                                  </DialogClose>
                              </DialogFooter>
                              </TabsContent>
                              <TabsContent value="edit">
                              <Label>Select Clinical Area to Edit</Label>
                              <Select value={selectedEditArea} onValueChange={handleSelectChange}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Clinical Area"/>
                                </SelectTrigger>
                                <SelectContent className="focus-visible:ring-transparent">
                                  {areas.map((area) => (
                                    <SelectItem key={area.id} value={area.id}>
                                      {area?.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              {isEditing && (
                                  <div className="mt-2">
                                    <Label>Edit Clinical Area</Label>
                                    <Input
                                      type="text"
                                      value={editedAreaName}
                                      onChange={handleNameChange}
                                    />
                                    <div className="flex justify-end mt-2">
                                      <DialogClose>
                                    <Button onClick={handleAreaEdit}>Save</Button>
                                      </DialogClose>
                                    </div>
                                  </div>
                                )}
                              
                                </TabsContent>
                              <TabsContent value="delete">
                              <Label>Select Clinical Area to Delete</Label>
                              <Select value={selectedDeleteArea || null} onValueChange={(e)=> setSelectedDeleteArea(e)}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Clinical Area"/>
                                </SelectTrigger>
                                <SelectContent className="focus-visible:ring-transparent">
                                  {areas.map((area) => (
                                    <SelectItem key={area.id} value={area.id}>
                                      {area?.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                                  <div className="flex mt-2 justify-end">
                                    <DialogClose>
                                    <Button onClick={handleAreaDelete}>
                                      Delete
                                    </Button>
                                    </DialogClose>
                                  </div>
                                </TabsContent>
                            </Tabs>
                            </DialogContent>
                          </Dialog>
                    <Link className="mx-2" href={'/schedule'}><Button>
                    Return
                    </Button></Link>
                    <Button className="bg-green-500" onClick={handleEnterSchedule} disabled={isSubmitting}>
                        Update Schedule
                    </Button>
                    </div>
                </div>
                    <div className="mt-4">

                    </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
                <div className="flex flex-col w-[20rem]">
                    <ClinicalInstructorSelect
                    onSelectInstructor={(selectedInstructor) => setSelectedInstructor(selectedInstructor)}
                    value={selectedInstructor}
                    clinicalInstructor={clinicalInstructor}
                    required
                    />
            
                    </div>
                    <div className="flex flex-col w-[20rem]">
                      <Label className="mb-2 text-md" htmlFor="hours">Select Clinical Hour:</Label>
                      <Select value={selectedClinicalHours} onValueChange={(e) => setSelectedClinicalHours(e)} id="hours">
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
                          <Select value={selectedArea} onValueChange={(e) => setSelectedArea(e)} id="area" className="mr-2 focus-visible:ring-transparent">
                            <SelectTrigger>
                              <SelectValue placeholder="Clinical Area"/>
                            </SelectTrigger>
                            <SelectContent className="focus-visible:ring-transparent">
                              {areas.map((area) => (
                                <SelectItem key={area.id} value={area.id}>
                                  {area?.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>     
                      </div>
                    <div className="flex flex-col w-[20rem]">
                    <Label className="mb-2 text-md" htmlFor="date">Date:</Label>
                    <DatePickerWithRange
                    onSelectDateRange={setSelectedDateRange}
                    value={sanitizedDates}
                    />
                    </div>
                    <div className="flex flex-col w-[20rem]">
                      <Label className="mb-2 text-md" htmlFor="group">Select Group:</Label>
                      <Select id="group" value={selectedGroup} onValueChange={(e) => setSelectedGroup(e)}>
                          <SelectTrigger>
                            <SelectValue  placeholder="Group"/>
                          </SelectTrigger>
                          <SelectContent>
                          <SelectItem value="A">Group A</SelectItem>
                          <SelectItem value="B">Group B</SelectItem>
                          </SelectContent>
                      </Select>
                      </div>
                      <div className="flex flex-col w-[20rem]">
                        <Label className="mb-2 text-md" htmlFor="yearLevel">Select Year Level:</Label>
                        <Select id="yearLevel" value={selectedYearLevel} onValueChange={handleYearLevelChange}>
                          <SelectTrigger>
                            <SelectValue placeholder="Year Level" />
                          </SelectTrigger>
                          <SelectContent>
                            {yearLevels.map((level) => (
                              <SelectItem key={level.value} value={level.value}>
                                {level.name}
                              </SelectItem>
                            ))}
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
                        value={selectedWeek}
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
                            value={selectedStudents}
                        />
                </div>
        </>
    )
}
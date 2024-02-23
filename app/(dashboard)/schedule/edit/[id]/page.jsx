'use client'

import { useEffect, useState } from "react";
import { StudentList } from "./_components/student-list";
import { ClinicalInstructorSelect } from "./_components/clinical-instructor";
import { DatePickerWithRange } from "./_components/date-picker";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";

function EditSchedule({ params }){
    
    const {data: session } = useSession();

    const [selectedGroup, setSelectedGroup] = useState(""); // Store selected group
    const [selectedYearLevel, setSelectedYearLevel] = useState(""); // Store selected year level
    const [students, setStudents] = useState([]); // Initialize students state
    const [selectedClinicalHours, setSelectedClinicalHours] = useState("");
    const [selectedDateRange, setSelectedDateRange] = useState([]);
    const [selectedStudents, setSelectedStudents] = useState([]);
    const [selectedInstructor, setSelectedInstructor] = useState(null);
    const [selectedClinicalArea, setSelectedClinicalArea] = useState("");
    const [week, setSelectedWeek] = useState("");
  
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [sanitizedDates, setSanitizedDates] = useState([]);

   const [scheduleId, setScheduleId] = useState("");
  
    const userId = session?.token.id;
    const router = useRouter();
  
  
    const handleGroupChange = (event) => {
      setSelectedGroup(event.target.value);
    };
  
    const handleYearLevelChange = (event) => {
      setSelectedYearLevel(Number(event.target.value));
    };
    const handleWeekChange = (event) => {
      setSelectedWeek(event.target.value);
    };
    const handleClinicalHoursChange = (event) => {
        setSelectedClinicalHours(event.target.value);
    };
    const handleClinicalAreaChange = (event) => {
        setSelectedClinicalArea(event.target.value);
    };
    const handleSanitizeUser = (user) => {

        const clinicalInstructor = [];
        const students = [];
        user.forEach((sanitizeUser) =>{
            if(sanitizeUser.role === 'ClinicalInstructor'){
                clinicalInstructor.push(sanitizeUser.id);
            }
            if(sanitizeUser.role === 'Student'){
                students.push(sanitizeUser.id)
            }
        })
        setSelectedInstructor(clinicalInstructor);
        setSelectedStudents(students);
    }
    const handleSanitizeDate = (schedule) => {
      if (!Array.isArray(schedule.dateFrom) || schedule.dateFrom.length === 0 ||
          !Array.isArray(schedule.dateTo) || schedule.dateTo.length === 0) {
        throw new Error('Missing or empty dateFrom or dateTo arrays');
      }
        const sanitizedDates = schedule.dateFrom.map((fromStr, index) => {
        const fromDate = new Date(Date.parse(fromStr));
        const toDate = new Date(Date.parse(schedule.dateTo[index]));
    
        if (isNaN(fromDate.getTime()) || isNaN(toDate.getTime())) {
          throw new Error(`Invalid date format at index ${index}`);
        }
    
        if (fromDate.getTime() > toDate.getTime()) {
          throw new Error(`fromDate must be before or equal to toDate at index ${index}`);
        }
        return { from: fromDate, to: toDate };

      });
      setSanitizedDates(sanitizedDates)

    };
    
      useEffect(() => {
        const fetchUserData = async () => {
          const scheduleId = params.id;
          const response = await fetch(`/api/getScheduleEdit?id=${scheduleId}`);
          const schedule = await response.json();
          const  user  = schedule.user; // Assume "user" contains clinical instructor and students
    
          handleSanitizeUser(user);
          handleSanitizeDate(schedule);
          setSelectedGroup(schedule.groupId);
          setSelectedYearLevel(schedule.yearLevel);
          setSelectedClinicalArea(schedule.area);
          setSelectedClinicalHours(schedule.clinicalHours);
          setSelectedWeek(schedule.week);
          setScheduleId(schedule.id);
        };

        fetchUserData();
      }, [params.id]);

  
    useEffect(() => {
      (async () => {
        try {
          const response = await fetch('/api/student');
          const students = await response.json();
    
          if (!students) {
            console.log("Students is empty");
          } else {
          }
    
          setStudents(students);
        } catch (error) {
          console.error("Failed to fetch students", error);
        }
      })();
    }, [selectedGroup, selectedYearLevel]);
  
  
    const handleEnterSchedule = async () => {
      try {
        setIsSubmitting(true);
    
        // Ensure selectedDateRange contains objects with valid Date objects
        const formattedDates = selectedDateRange.map(({ from, to }) => ({
          from: new Date(from),
          to: new Date(to),
        }));

    
        const data = {
          clinicalInstructor: selectedInstructor,
          clinicalHours: selectedClinicalHours,
          area: selectedClinicalArea,
          dateFrom: formattedDates.map((date) => date.from),
          dateTo: formattedDates.map((date) => date.to),
          userId,
          group: selectedGroup,
          yearLevel: selectedYearLevel,
          students: selectedStudents,
          week: week,
          scheduleId,
        };
    
        console.log('Data to be sent:', data);
    
        const response = await fetch(`/api/schedule/${scheduleId}/update`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });
    
        if (response.ok) {
          const updatedSchedule = await response.json();
          // Update UI or handle success based on updatedSchedule
          console.log('Schedule updated successfully!');
          router.push('/schedule');
        } else {
          const errorData = await response.json();
          console.error('Failed to update schedule:', errorData);
          // Handle specific error based on errorData (e.g., display error message)
        }
      } catch (error) {
        console.error('Error updating schedule:', error);
        // Handle general error (e.g., network error, unexpected data)
      } finally {
        setIsSubmitting(false);
      }
    };
    
    
    
  
    return (
  <>
    <div className="p-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-y-2">
          <h1 className="text-2xl font-medium">Schedule Edit Setup</h1>
          <span className="text-sm text-slate-700">Edit Schedule</span>
        </div>
        
        <div>
        <Link className="mx-2" href={'/schedule'}><Button>
          Return
        </Button></Link>
          <Button className="bg-green-500" onClick={handleEnterSchedule} disabled={isSubmitting}>
              Update Schedule
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
        <div className="flex items-center gap-x-2">
        <ClinicalInstructorSelect
          onSelectInstructor={(selectedInstructor) => setSelectedInstructor(selectedInstructor)}
          value={selectedInstructor}
          required
        />
  
        </div>
        <div className="flex items-center gap-x-2">
            <label htmlFor="hours">Clinical Hours:</label>
            <select id="hours" value={selectedClinicalHours} onChange={handleClinicalHoursChange}>
            <option value="">Select Clinical Hours</option>
            <option value="1">Morning Shift</option>
            <option value="2">Afternoon Shift</option>
            <option value="3">Graveyard Shift</option>
            </select>
             </div>
        <div className="flex items-center gap-x-2">
          <label htmlFor="area">Area:</label>
          <select id="area" value={selectedClinicalArea} onChange={handleClinicalAreaChange}>
              <option value="">Select Clinical Area</option>
              <option value="WMMC">WMMC</option>
              <option value="General">General</option>          
              <option value="Doctors">Doctor's</option>          
              <option value="Brent">Brent</option> 
              <option value="StaMariaHC">Sta Maria Health Center</option>                   
              </select>     
               </div>
        <div className="flex items-center gap-x-2">
          <label htmlFor="date">Date:</label>
          <DatePickerWithRange
          onSelectDateRange={setSelectedDateRange}
          value={sanitizedDates}
          />
        </div>
        <div className="flex items-center gap-x-2">
            <label htmlFor="group">Group:</label>
            <select id="group" value={selectedGroup} onChange={handleGroupChange}>
            <option value="">All Groups</option>
              <option value="A">Group A</option>
              <option value="B">Group B</option>
            </select>
          </div>
          <div className="flex items-center gap-x-2">
            <label htmlFor="yearLevel">Year Level:</label>
            <select id="yearLevel" value={selectedYearLevel} onChange={handleYearLevelChange}>
              <option value="">All Year Levels</option>
              <option value="1">1st year</option>
              <option value="2">2nd year</option>          
              <option value="3">3rd year</option>          
              <option value="4">4th year</option>          
              </select>
          </div>
          <div className="flex items-center gap-x-2">
            <label htmlFor="week">Week/s:</label>
            <input 
            type="text" 
            id="week"
            className="border border-slate-300 rounded-xl p-1" 
            placeholder="e.g 1 or 1-3" 
            onChange={handleWeekChange}
            value={week}
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

  export default EditSchedule;
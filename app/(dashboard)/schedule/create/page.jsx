'use client'

import { useEffect, useState } from "react";
import { StudentList } from "./_components/student-list";
import { ClinicalInstructorSelect } from "./_components/clinical-instructor";
import { DatePickerWithRange } from "./_components/date-picker";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

function CreateSchedule() {

  const {data: session } = useSession();

  const [selectedGroup, setSelectedGroup] = useState(""); // Store selected group
  const [selectedYearLevel, setSelectedYearLevel] = useState(""); // Store selected year level
  const [students, setStudents] = useState([]); // Initialize students state

  const [selectedDateRange, setSelectedDateRange] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [selectedInstructor, setSelectedInstructor] = useState(null);
  const [week, setSelectedWeek] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);


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

  function getDatesInRanges(startDates, endDates) {
    const dates = [];
  
    // Iterate over each pair of start and end dates
    for (let i = 0; i < startDates.length; i++) {
      let startDate = new Date(startDates[i]); // Convert string to Date object
      let endDate = new Date(endDates[i]); // Convert string to Date object
  
      // Loop through dates from start date to end date for each pair
      while (startDate <= endDate) {
        dates.push(new Date(startDate)); // Add current date to the array
        startDate.setDate(startDate.getDate() + 1); // Move to the next day
      }
    }
  
    return dates;
  }
  


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
        clinicalHours: document.getElementById('hours').value,
        area: document.getElementById('area').value,
        dateFrom: formattedDates.map((date) => date.from),
        dateTo: formattedDates.map((date) => date.to),
        userId,
        group: selectedGroup,
        yearLevel: selectedYearLevel,
        students: selectedStudents,
        week: week,
        dates: DatesofDuty,
      };
  
      console.log('Data to be sent:', data);
  
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
      }
    } catch (error) {
      console.error('Error creating schedule:', error);
    } finally {
      setIsSubmitting(false);
      router.push('/schedule');
    }
  };
  
  

  return (
<>
  <div className="p-6">
    <div className="flex items-center justify-between">
      <div className="flex flex-col gap-y-2">
        <h1 className="text-2xl font-medium">Schedule Setup</h1>
        <span className="text-sm text-slate-700">Create Schedule</span>
      </div>
      <div>
        <Button onClick={handleEnterSchedule} disabled={isSubmitting}>
            Enter Schedule
        </Button>
      </div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
      <div className="flex items-center gap-x-2">
      <ClinicalInstructorSelect
        onSelectInstructor={(selectedInstructor) => setSelectedInstructor(selectedInstructor)}
        required
      />

      </div>
      <div className="flex items-center gap-x-2">
        <label htmlFor="hours">Clinical Hours:</label>
          <select id="hours">
            <option value="">Select Clinical Hours</option>
            <option value="1">Morning Shift</option>
            <option value="2">Afternoon Shift</option>
            <option value="3">Graveyard Shift</option>
          </select>   
           </div>
      <div className="flex items-center gap-x-2">
        <label htmlFor="area">Area:</label>
        <select id="area">
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
        />
      </div>
      <div className="flex items-center gap-x-2">
          <label htmlFor="group">Group:</label>
          <select id="group" onChange={handleGroupChange}>
          <option value="">All Groups</option>
            <option value="A">Group A</option>
            <option value="B">Group B</option>
          </select>
        </div>
        <div className="flex items-center gap-x-2">
          <label htmlFor="yearLevel">Year Level:</label>
          <select id="yearLevel" onChange={handleYearLevelChange}>
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

export default CreateSchedule
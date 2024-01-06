
import { useEffect, useState } from "react"
import { StudentScheduleItem } from "./student-schedule-item";

const fetchSchedules = async (studentId) => {
    const params = new URLSearchParams();
    params.append('studentId', studentId);
  
    const url = `/api/getStudentSchedule?${params.toString()}`;
    const response = await fetch(url);
  
    if (!response.ok) {
      throw new Error(`Failed to fetch schedules. Status: ${response.status}`);
    }
  
    const schedules = await response.json();
    return schedules;
  };
export const StudentScheduleList =  ({userId}) => {
    const [schedules, setSchedules] = useState([]);
    
    const studentId = userId;

    useEffect(() => {
        const getSchedule = async () => {
          try {
            const schedules = await fetchSchedules(studentId);
            console.log(schedules);
    
            if (!schedules) {
              console.warn("Schedules are empty");
            } else {
              setSchedules(schedules);
            }
          } catch (error) {
            console.error("Failed to fetch schedules", error);
          }
        };
    
        getSchedule();
      }, [studentId]);

      
    
      const studentSchedule = schedules.schedules || [];

      console.log("This is the student schedule", studentSchedule);
    
    return (
        <>
            <div>
            </div>
            <table className="table-auto  w-full shadow-xl rounded-md text-sm">
        <thead>
          <tr className="bg-gray-200 items-center">
            <th className="py-2 px-4 font-semibold">Date/s</th>
            <th className="py-2 px-4 font-semibold">Clinical Instructor</th>
            <th className="py-2 px-4 font-semibold">Area</th>
            <th className="py-2 px-4 font-semibold">Group</th>
            <th className="py-2 px-4 font-semibold">Year Level</th>
            <th className="py-2 px-4 font-semibold">Hours</th>
            <th className="py-2 px-4 font-semibold">View Resources</th>
          </tr>
        </thead>
        <tbody>
          
            {studentSchedule.map((schedule) => (
            <StudentScheduleItem key={schedule.id}{...schedule} />
            ))}
        </tbody>
      </table>
         </>
    )
}


'use client'

import { useEffect, useState } from "react"
import { CIScheduleItem } from "./ci-schedule-item";

const fetchSchedules = async (clinicalInstructorId) => {
    const params = new URLSearchParams();
    params.append('clinicalInstructorId', clinicalInstructorId);
  
    const url = `/api/getCISchedule?${params.toString()}`;
    const response = await fetch(url);
  
    if (!response.ok) {
      throw new Error(`Failed to fetch schedules. Status: ${response.status}`);
    }
  
    const schedules = await response.json();
    return schedules;
  };
export const CIScheduleList =  ({userId}) => {
    const [schedules, setSchedules] = useState([]);
    
    const clinicalInstructorId = userId;

    useEffect(() => {
        const getSchedule = async () => {
          try {
            const schedules = await fetchSchedules(clinicalInstructorId);
    
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
      }, [clinicalInstructorId]);

      
    
      const clinicalInstructorSchedule = schedules.schedules || [];

    
    return (
        <>
            <div>
            </div>
            <table className="table-auto overflow-x-scroll w-full shadow-xl rounded-md text-sm">
        <thead>
          <tr className="bg-gray-200 items-center">
            <th className="py-2 px-4 font-semibold">Date/s</th>
            <th className="py-2 px-4 font-semibold">Area</th>
            <th className="py-2 px-4 font-semibold">Group</th>
            <th className="py-2 px-4 font-semibold">Year Level</th>
            <th className="py-2 px-4 font-semibold">Hours</th>
            <th className="py-2 px-4 font-semibold">View Student List</th>
            <th className="py-2 px-4 font-semibold">View Resources</th>
          </tr>
        </thead>
        <tbody>
          
            {clinicalInstructorSchedule.map((schedule) => (
            <CIScheduleItem key={schedule.id}{...schedule} />
            ))}
        </tbody>
      </table>
         </>
    )
}


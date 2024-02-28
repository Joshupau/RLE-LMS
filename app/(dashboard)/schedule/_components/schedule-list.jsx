'use client'

import { useState, useEffect } from "react";
import { ScheduleItem } from "./schedule-item";

const ScheduleList = () => {
  const [schedules, setSchedules] = useState([]);
  const [shouldFetch, setShouldFetch] = useState(false);

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const response = await fetch("/api/getSchedule");
        const schedules = await response.json();


        if (!schedules) {
          console.warn("Schedules are empty");
        } else {
          setSchedules(schedules);
        }
      } catch (error) {
        console.error("Failed to fetch schedules", error);
      }
    };

      fetchSchedules();
    }, [schedules]);

  if (!schedules.length) return <p>Loading...</p>;


  return (
    <>
    <div className="overflow-y-auto">
      <table className="table-auto  w-full shadow-xl rounded-md text-sm">
        <thead>
          <tr className="bg-gray-200 items-center">
            <th className="py-2 px-4 font-semibold">Date/s</th>
            <th className="py-2 px-4 font-semibold">Clinical Instructor</th>
            <th className="py-2 px-4 font-semibold">Area</th>
            <th className="py-2 px-4 font-semibold">Group</th>
            <th className="py-2 px-4 font-semibold">Year Level</th>
            <th className="py-2 px-4 font-semibold">Hours</th>
            <th className="py-2 px-4 font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody>
          {schedules.map((schedule) => (
            <ScheduleItem key={schedule.id} {...schedule}  />
          ))}
        </tbody>
      </table>
    </div>
    </>
  );
};


export default ScheduleList;

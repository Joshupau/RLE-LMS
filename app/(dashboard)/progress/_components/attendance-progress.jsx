'use client'

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"

  import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"

import { useState } from "react"
  
export const AttendanceProgress = ({schedules}) =>{
    const [selectedWeek, setSelectedWeek] = useState('');
    const [selectedDate, setSelectedDate] = useState('');
  
// Function to convert a date range to an array of individual dates
const getDatesInRange = (startDate, endDate) => {
    const dates = [];
    let currentDate = new Date(startDate);
    const finalDate = new Date(endDate);
    while (currentDate <= finalDate) {
      dates.push(currentDate.toISOString().split('T')[0]);
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return dates;
  };
  
  // Function to convert date ranges into an array of individual dates
  const flattenDateRanges = (dateFrom, dateTo) => {
    let allDates = [];
    dateFrom.forEach((startDate, index) => {
      const datesInRange = getDatesInRange(startDate, dateTo[index]);
      allDates = allDates.concat(datesInRange);
    });
    return allDates;
  };
  const filteredSchedules = schedules.filter(schedule => schedule.week === selectedWeek);

  // Get all dates for the selected week using the sample data
  const allDatesForWeek = flattenDateRanges(filteredSchedules.map(schedule => schedule.dateFrom), filteredSchedules.map(schedule => schedule.dateTo));

    
    return (
      <Card>
        <CardContent>
          <div className="flex my-2 flex-col space-y-2 justify-end">
            <Select onValueChange={(e) => setSelectedWeek(e)} required>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Week" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {schedules.map((schedule, index) => (
                    <SelectItem key={index} value={schedule.week}>
                      {schedule.week}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          {selectedWeek && (
            <>
              <div className="flex my-2 flex-col space-y-2 justify-end">
                <Select onValueChange={(e) => setSelectedDate(e)} required>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Date" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {/* Render dates for the selected week */}
                      {allDatesForWeek.map((date, index) => (
                        <SelectItem key={index} value={date}>
                          {date}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              {/* Render student list */}
              <div>
                List of students
              </div>
            </>
          )}
        </CardContent>
      </Card>
    );
}
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

  import { useState, useEffect } from "react";
  import { Label } from "@/components/ui/label";

  import StudentDataTable from "../StudentDataTable";



  
  export const AttendanceProgress = ({ attendance }) => {
    const [selectedWeek, setSelectedWeek] = useState('');
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedDateData, setSelectedDateData] = useState([]);
    const [selectedWeekData, setSelectedWeekData] = useState(null);

    const [key, setKey] = useState(0); // Key variable to force remount

    const handleWeekSelect = (week) => {
      setSelectedWeek(week);
      setSelectedDate('');
    };
    
    const handleDateSelect = (date) => {
      setSelectedDate(date);
    };

    const groupedByWeek = {};
    attendance.forEach(({ week, userScheduling }) => {
      if (!groupedByWeek[week]) {
        groupedByWeek[week] = {};
      }
      // Group the userScheduling data by date within each week
      userScheduling.forEach(({ date, ...rest }) => {
        const formattedDate = new Date(date).toLocaleDateString("en-US");
        if (!groupedByWeek[week][formattedDate]) {
          groupedByWeek[week][formattedDate] = [];
        }
        groupedByWeek[week][formattedDate].push({ date, ...rest });
      });
    });

    useEffect(() => {
      if (selectedWeek) {
        const selectedWeekData = attendance.find((item) => item.week === selectedWeek)?.userScheduling;
        setSelectedWeekData(selectedWeekData);
      }
    }, [selectedWeek, key]); // Include key in the dependencies
  
    // Set data for the selected date when both week and date are selected
    useEffect(() => {
      if (selectedWeek && selectedDate && groupedByWeek[selectedWeek] && groupedByWeek[selectedWeek][selectedDate]) {
        setSelectedDateData(groupedByWeek[selectedWeek][selectedDate]);
      }
    }, [selectedWeek, selectedDate]);
    
    
    return (
      <Card>
        <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
          <div className="flex my-2 flex-col space-y-2 justify-end">
            <Label htmlFor="">Week</Label>
            <Select onValueChange={(e) => handleWeekSelect(e)} required>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Week" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {attendance.map(({ week }, index) => (
                    <SelectItem key={index} value={week}>
                      Week {week}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          {selectedWeek && (
            <div className="flex my-2 flex-col space-y-2 justify-end">
              <Label>Date</Label>
              <Select onValueChange={(e, index) => handleDateSelect(e, index)} required>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Date" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {Object.keys(groupedByWeek[selectedWeek]).map((date, index) => (
                      <SelectItem key={index} value={date}>
                        {date}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          )}
            </div>
            {selectedWeek && selectedDate && (
              <div className="flex my-2 flex-col space-y-2 justify-end">
                <Label>Student List for week {selectedWeek} on {selectedDate}</Label>
                <StudentDataTable data={selectedDateData} date={selectedDate} />
              </div>
            )}
        </CardContent>
      </Card>
    );
  };
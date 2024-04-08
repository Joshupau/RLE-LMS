'use client'

import { Button } from "@/components/ui/button";
import {
  Table,
  TableHead,
  TableHeader,
  TableRow,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";

const StudentDataTable = ({ data, date }) => {

    const [studentData, setStudentData] = useState([]);
    const [Sdate, setSDate] = useState();

    const { toast } = useToast();

    useEffect(() => {
      if (data) {
        const updatedStudentData = data.map((student) => ({
          id: student.id,
          firstName: student.user.firstName,
          lastName: student.user.lastName,
          timeIn: student.timeIn ? new Date(student.timeIn).toLocaleTimeString("en-GB", { timeZone: "UTC" }): '',
          timeOut: student.timeOut ? new Date(student.timeOut).toLocaleTimeString("en-GB", { timeZone: "UTC" }): '',
          remark: student.notes,
        }));
        setStudentData(updatedStudentData);
        setSDate(date)
    }
    }, [data]);

  const handleTimeInChange = (e, studentId) => {
    const updatedData = studentData.map((student) =>
      student.id === studentId ? { ...student, timeIn: e.target.value } : student
    );
    setStudentData(updatedData);
  };

  // Handle time out change for a specific student
  const handleTimeOutChange = (e, studentId) => {
    const updatedData = studentData.map((student) =>
      student.id === studentId ? { ...student, timeOut: e.target.value } : student
    );
    setStudentData(updatedData);
  };

  // Handle remarks change for a specific student
  const handleRemarkChange = (e, studentId) => {
    const updatedData = studentData.map((student) =>
      student.id === studentId ? { ...student, remark: e.target.value } : student
    );
    setStudentData(updatedData);
  };

  const handleUpdateAttendance = async () =>{
   try {

     const response = await fetch('/api/attendance', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        studentData: studentData,
        date: Sdate,
      })
     });
     if(response.ok){
      toast({
        title: "Attendance Updated",
        description: "Attendance has been recorded successfully updated.",
        status: "success",
        isClosable: true
      });
     } else {
      toast({
        title: "Update Failed",
        description: "Failed to record attendance.",
        status: "error",
        isClosable: true
      });
     }
   } catch (error) {
    console.error('Error updating attendance:', error);
  
    toast({
      title: "Error",
      description: "Failed to update attendance data. Please try again later.",
      status: "error",
      isClosable: true
    }); 
  }
  }

  return (
    <div className="overflow-x-auto rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-center">Student Name</TableHead>
            <TableHead className="text-center">Time In</TableHead>
            <TableHead className="text-center">Time Out</TableHead>
            <TableHead className="text-center">Remarks</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {studentData.map((student) => (
            <TableRow key={student.id}>
              <TableCell className="text-center">
                {student.firstName} {student.lastName}
              </TableCell>
              <TableCell className="text-center">
                <Input
                  type="time"
                  placeholder="Time In"
                  value={student.timeIn}
                  onChange={(e) => handleTimeInChange(e, student.id)}
                  required
                />
              </TableCell>
              <TableCell className="text-center">
                <Input
                  type="time"
                  placeholder="Time Out"
                  value={student.timeOut}
                  onChange={(e) => handleTimeOutChange(e, student.id)}
                  required
                />
              </TableCell>
              <TableCell className="text-center">
                <Input
                  type="text"
                  placeholder="Remarks"
                  value={student.remark}
                  onChange={(e) => handleRemarkChange(e, student.id)}
                  required
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="m-4">
        <Button type="submit" onClick={handleUpdateAttendance}>
            Update Attendance
        </Button>
      </div>
    </div>
  );
};

export default StudentDataTable;
import { getScheduleId } from "@/actions/get-schedule-id";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import DataTable from "./DataTable";
import {
  Table,
  TableHeader,
  TableRow,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getScheduleWithUsers } from "@/actions/get-schedule";
import { redirect } from "next/navigation";

export default async function ScheduleIdPage ({ params }) {

    const scheduleId = params.id;

    const session = await getServerSession(authOptions);
    const selectSchedule = await getScheduleWithUsers();
  
    const schedules  = await getScheduleId(scheduleId);
    if(session.token.role === 'Student'){
      return <p>Not allowed on this page!</p>;
    }


    const clinicalInstructor = schedules.user.find((user) => user.role === 'ClinicalInstructor');
    const filteredUsers = schedules.user.filter((user) => user.role === 'Student');

    const studentData = filteredUsers.map((user) => ({
      id: user.id,
      name: `${user.firstName} ${user.lastName}`,
      contacts: user?.contact,
      scheduleId: schedules.id
    }));



  return (
    <div className="p-6">
    <div className="flex items-center justify-between">
      <div className="flex flex-col gap-y-2">
        <h1 className="text-2xl font-medium">Schedule Details</h1>
      </div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
            <div className="overflow-x-auto">
            <Table className="rounded-md border" >
                <TableHeader>
                <TableRow className="bg-slate-200 hover:bg-slate-200">
                    <TableCell className="font-semibold">Field</TableCell>
                    <TableCell className="text-center font-semibold">Details</TableCell>
                </TableRow>
                </TableHeader>
                <TableBody>
                <TableRow className="border-b border-gray-300">
                    <TableCell className="font-semibold">Schedule Dates</TableCell>
                    <TableCell className="text-center">
                    <p>
                    {formatDateTimeRange(schedules.dateFrom, schedules.dateTo).map((dateRange, index) => (
                  <span key={index}>{dateRange}<br/></span>
                  ))}
                    </p>
                    </TableCell>
                </TableRow>
                <TableRow className="border-b border-gray-300">
                    <TableCell className="font-semibold">Group:</TableCell>
                    <TableCell className="text-center">{schedules.groupId}</TableCell>
                </TableRow>
                <TableRow className="border-b border-gray-300">
                    <TableCell className="font-semibold">Area:</TableCell>
                    <TableCell className="text-center">{schedules.clinicalArea.name}</TableCell>
                </TableRow>
                <TableRow className="border-b border-gray-300">
                    <TableCell className="font-semibold">Clinical Hours:</TableCell>
                    <TableCell className="text-center">{Number(schedules.clinicalHours) === 1 ? "AM Shift" :
                            Number(schedules.clinicalHours) === 2 ? "PM Shift" :
                            Number(schedules.clinicalHours) === 3 ? "Graveyard Shift" : null}
              </TableCell>
                </TableRow>
                <TableRow className="border-b border-gray-300">
                    <TableCell className="font-semibold">Year Level:</TableCell>
                    <TableCell className="text-center">{schedules.yearLevel}</TableCell>
                </TableRow>
                <TableRow className="border-b border-gray-300">
                    <TableCell className="font-semibold">Clinical Instructor</TableCell>
                    <TableCell className="text-center">
                  {clinicalInstructor.firstName} {clinicalInstructor.lastName}
                    </TableCell>
                </TableRow>

                </TableBody>
            </Table>
            </div>
            <div className="overflow-x-auto">
                    <DataTable schedules={selectSchedule} data={studentData} user={session.token}/>
            </div>
            </div>
        </div>
  )
}

const formatDate = (dateString) => {
    try {
        const options = { year: "numeric", month: "long", day: "numeric" };
        return new Date(dateString).toLocaleDateString(undefined, options);
    } catch (error) {
        console.error("Error formatting date:", error);
      return "Invalid Date";
    }
  };

const formatDateTimeRange = (dateFromArray, dateToArray) => {
    try {
      if (dateFromArray.length === 1 && !dateToArray.length === 1) {
        const formattedDate = formatDate(dateFromArray[0]);
        return [formattedDate]; // Return an array with the single formatted date
      }
      
      const combinedDates = dateFromArray
        .map((dateFrom, index) => {
          const formattedDateTo = formatDate(dateToArray[index]);
          return `${formatDate(dateFrom)} - ${formattedDateTo}`;
        })
        .filter(Boolean); // Remove undefined values if dates are of different lengths
  
      return combinedDates;
    } catch (error) {
      console.error("Error formatting date range:", error);
      return "Invalid Date Range";
    }
  };

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { TableCell, TableRow } from "@/components/ui/table"; 
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Pencil, Trash2, ScanSearch, MoreVertical } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useToast } from "@/components/ui/use-toast";

const ScheduleItem = ({ id, dateFrom, dateTo, user, area,clinicalArea, clinicalHours, groupId, yearLevel }) => {
  const router = useRouter();

  const clinicalInstructor = user.find((user) => user.role === 'ClinicalInstructor');

  const { toast } = useToast();
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const handleViewSchedule = () => {
    router.push(`/schedule/${id}`);
  };

  const handleEditSchedule = () => {
    router.push(`/schedule/edit/${id}`);
  };

  const handleDeleteSchedule = async () => {
    try {
      const response = await fetch(`/api/schedule/${id}?id=${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        toast({
          title: "Uh oh...",
          description:  "Cannot delete a schedule once there are submitted cases or resource posts.",
          status: "destructive",
        });        
      }
      if(response.ok){
        toast({
          title: "Success",
          description:  "Successfully deleted the schedule.",
          status: "Success",
        });   
      }
    } catch (error) {
      console.error('Error deleting schedule:', error);
      toast({
        title: "Uh oh...",
        description:  "Cannot delete a schedule once there are submitted cases or resource posts.",
        status: "destructive",
      });   
    }
  };

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
        return [formattedDate];
      }
      const combinedDates = dateFromArray.map((dateFrom, index) => {
        const formattedDateTo = formatDate(dateToArray[index]);
        return `${formatDate(dateFrom)} - ${formattedDateTo}`;
      }).filter(Boolean);

      return combinedDates;
    } catch (error) {
      console.error("Error formatting date range:", error);
      return "Invalid Date Range";
    }
  };

  return (
    <TableRow>
      <TableCell className="py-2 px-4 text-center">
        {formatDateTimeRange(dateFrom, dateTo).map((dateRange, index) => (
          <span key={index}>{dateRange}<br /></span>
        ))}
      </TableCell>
      <TableCell className="py-2 px-4 text-center">{`${clinicalInstructor?.firstName} ${clinicalInstructor?.lastName}`}</TableCell>
      <TableCell className="py-2 px-4 text-center">{area}{clinicalArea?.name}</TableCell>
      <TableCell className="py-2 px-4 text-center">{groupId}</TableCell>
      <TableCell className="py-2 px-4 text-center">{yearLevel}</TableCell>
      <TableCell className="py-2 px-4 text-center">
        {Number(clinicalHours) === 1 ? "AM Shift" :
          Number(clinicalHours) === 2 ? "PM Shift" :
            Number(clinicalHours) === 3 ? "Graveyard Shift" : null}
      </TableCell>
      <TableCell className="py-2 px-4 text-center">
          <AlertDialog>
        <DropdownMenu>
        <DropdownMenuTrigger>
              <MoreVertical className="hover:opacity-70 rounded-full w-10 p-2 h-10  hover:bg-slate-200"/>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
                 <DropdownMenuGroup>
                    <DropdownMenuItem onClick={handleViewSchedule}>
                      <Pencil className="mr-2 h-4 w-4" />
                      <span>View Schedule Details</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleEditSchedule}>
                        <ScanSearch className="mr-2 h-4 w-4" />
                        <span >Edit Schedule</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                     <AlertDialogTrigger className="flex">
                        <Trash2 className="mr-2 h-4 w-4" />
                        <span >Delete Schedule</span>
                    </AlertDialogTrigger>
                    </DropdownMenuItem>
                      </DropdownMenuGroup>
                  </DropdownMenuContent>           
             </DropdownMenu>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the schedule
                  and remove the schedule data from our servers. <br /> <br />
                  Note: Once data is present in the resource or cases have been submitted, the schedule cannot be deleted.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteSchedule}>Continue</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
      </TableCell>
    </TableRow>
  );
};

export default ScheduleItem;

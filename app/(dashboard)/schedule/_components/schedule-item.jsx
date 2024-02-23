import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"


export const ScheduleItem = ({id, dateFrom, dateTo, user, area, clinicalHours, groupId, yearLevel}) => {
    const router = useRouter();
    const clinicalInstructor = user.find((user) => user.role === 'ClinicalInstructor');


    const handleViewSchedule = (value) => {
        router.push(`/schedule/${id}`, value);
    };
    const handleEditSchedule = (value) => {
      router.push(`/schedule/edit/${id}`, value);
  };

    const handleDeleteSchedule = async (id) => {
      try {

        console.log("ID when trying to delete", id);
        const response = await fetch(`/api/schedule/${id}?id=${id}`, {
          method: 'DELETE', // Ensure DELETE method
        });
        if (!response.ok) {
          throw new Error('Failed to delete schedule');
        }
          } catch (error) {
        console.error('Error deleting schedule:', error);
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
    
    
    return(
        <tr className="border-b border-gray-300">
        <td className="py-2 px-4 text-center">      
        {formatDateTimeRange(dateFrom, dateTo).map((dateRange, index) => (
                  <span key={index}>{dateRange}<br/></span>
                ))}
        </td>
          <td className="py-2 px-4 text-center">{`${clinicalInstructor.firstName} ${clinicalInstructor.lastName}`}</td>
        <td className="py-2 px-4 text-center">{area}</td>
        <td className="py-2 px-4 text-center">{groupId}</td>
        <td className="py-2 px-4 text-center">{yearLevel}</td>
        <td className="py-2 px-4 text-center">
          {Number(clinicalHours) === 1 ? "AM Shift" :
            Number(clinicalHours) === 2 ? "PM Shift" :
              Number(clinicalHours) === 3 ? "Graveyard Shift" : null}
        </td>
        <td className="py-2 px-4 text-center">
            <Button onClick={handleViewSchedule}>View Schedule</Button>
        </td>
        <td className="py-2 px-4 text-center">
          <AlertDialog>
          <AlertDialogTrigger>
            <Button variant="destructive">
              Delete
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the schedule
                and remove the schedule data from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
              onClick={() => handleDeleteSchedule(id)}
              >
                Continue
                </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        </td>
        <td className="py-2 px-4 text-center">
            <Button className="bg-blue-500 hover:bg-blue-600" onClick={handleEditSchedule}>Edit Schedule</Button>
        </td>
      </tr>
        
        );
}



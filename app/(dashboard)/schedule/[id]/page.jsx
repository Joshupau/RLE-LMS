import { getScheduleId } from "@/actions/get-schedule-id";
import { Button } from "@/components/ui/button";
import Link from "next/link";
const ScheduleIdPage = async ({ params }) => {

    const scheduleId = params.id;

    const schedules  = await getScheduleId(scheduleId);

    const clinicalInstructor = schedules.user.find((user) => user.role === 'ClinicalInstructor');


    console.log( { schedules } );
  return (
    <div className="p-6">
    <div className="flex items-center justify-between">
      <div className="flex flex-col gap-y-2">
        <h1 className="text-2xl font-medium">Schedule List</h1>
      </div>
        <Link href={'/schedule'}><Button>
          Return
        </Button></Link>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
            <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-300">
                <thead>
                <tr className="border-b border-gray-300">
                    <th className="py-2 px-4 font-semibold">Field</th>
                    <th className="py-2 px-4 font-semibold">Details</th>
                </tr>
                </thead>
                <tbody>
                <tr className="border-b border-gray-300">
                    <td className="py-2 px-4 font-semibold">Schedule Dates</td>
                    <td className="py-2 px-4">
                    <p>
                    {formatDateTimeRange(schedules.dateFrom, schedules.dateTo).map((dateRange, index) => (
                  <span key={index}>{dateRange}<br/></span>
                  ))}
                    </p>
                    </td>
                </tr>
                <tr className="border-b border-gray-300">
                    <td className="py-2 px-4 font-semibold">Group:</td>
                    <td className="py-2 px-4">{schedules.groupId}</td>
                </tr>
                <tr className="border-b border-gray-300">
                    <td className="py-2 px-4 font-semibold">Area:</td>
                    <td className="py-2 px-4">{schedules.area}</td>
                </tr>
                <tr className="border-b border-gray-300">
                    <td className="py-2 px-4 font-semibold">Clinical Hours:</td>
                    <td className="py-2 px-4">{Number(schedules.clinicalHours) === 1 ? "AM Shift" :
                            Number(schedules.clinicalHours) === 2 ? "PM Shift" :
                            Number(schedules.clinicalHours) === 3 ? "Graveyard Shift" : null}
              </td>
                </tr>
                <tr className="border-b border-gray-300">
                    <td className="py-2 px-4 font-semibold">Year Level:</td>
                    <td className="py-2 px-4">{schedules.yearLevel}</td>
                </tr>
                <tr className="border-b border-gray-300">
                    <td className="py-2 px-4 font-semibold">Clinical Instructor</td>
                    <td className="py-2 px-4">
                    <p>{clinicalInstructor.firstName} {clinicalInstructor.lastName}</p>
                    </td>
                </tr>
                <tr className="border-b border-gray-300">
                    <td className="py-2 px-4 font-semibold">Students</td>
                    <td className="py-2 px-4">
                    <ol className="list-decimal">
                        {schedules.user.map((user, index) => (
                          user.role === 'Student' &&(

                            <li key={index}>{user.firstName} {user.lastName}</li>
                            )
                            ))}
                    </ol>
                    </td>
                </tr>
                </tbody>
            </table>
            </div>
            <div className="overflow-x-auto">
                    Extraboretche
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
  

export default ScheduleIdPage
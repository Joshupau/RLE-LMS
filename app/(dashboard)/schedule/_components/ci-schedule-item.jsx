import {
  Table,
  TableHead,
  TableHeader,
  TableRow,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import React from 'react'; // Import React

const CIScheduleItem = ({ id, dateFrom, dateTo, user, area, clinicalHours, groupId, yearLevel }) => {
  const router = useRouter();

  const handleViewSchedule = (value) => {
    router.push(`/schedule/${id}`, value);
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

  return (
    <TableRow>
      <TableCell className="py-2 px-4 text-center">
        {formatDateTimeRange(dateFrom, dateTo).map((dateRange, index) => (
          <span key={index}>{dateRange}<br /></span>
        ))}
      </TableCell>
      <TableCell className="py-2 px-4 text-center">{area}</TableCell>
      <TableCell className="py-2 px-4 text-center">{groupId}</TableCell>
      <TableCell className="py-2 px-4 text-center">{yearLevel}</TableCell>
      <TableCell className="py-2 px-4 text-center">
        {Number(clinicalHours) === 1 ? "AM Shift" :
          Number(clinicalHours) === 2 ? "PM Shift" :
            Number(clinicalHours) === 3 ? "Graveyard Shift" : null}
      </TableCell>
      <TableCell className="py-2 px-4 text-center">
        <Button onClick={handleViewSchedule}>View Students</Button>
      </TableCell>

    </TableRow>
  );
};

export default CIScheduleItem;

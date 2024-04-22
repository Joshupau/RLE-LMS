import {
    Table,
    TableHead,
    TableHeader,
    TableRow,
    TableBody,
    TableCell,
  } from "@/components/ui/table";

export const DeanPdfTemplate = ({data}) => {
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


    return(
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead className="text-center">Date/s</TableHead>
                    <TableHead className="text-center">Clinical Instructor</TableHead>
                    <TableHead className="text-center">Area</TableHead>
                    <TableHead className="text-center">Group</TableHead>
                    <TableHead className="text-center">Year Level</TableHead>
                    <TableHead className="text-center">Hours</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {data.map((schedule) => {
                    const clinicalInstructor = schedule.user?.find(user => user.role === 'ClinicalInstructor');
                    return (
                        <TableRow key={schedule.id}>
                            <TableCell className="py-2 px-4 text-center">
                                {formatDateTimeRange(schedule.dateFrom, schedule.dateTo).map((dateRange, index) => (
                                    <span key={index}>{dateRange}<br /></span>
                                ))}
                            </TableCell>
                            <TableCell className="py-2 px-4 text-center">{`${clinicalInstructor?.firstName} ${clinicalInstructor?.lastName}`}</TableCell>
                            <TableCell className="py-2 px-4 text-center">{schedule?.clinicalArea?.name}</TableCell>
                            <TableCell className="py-2 px-4 text-center">{schedule.groupId}</TableCell>
                            <TableCell className="py-2 px-4 text-center">{schedule.yearLevel}</TableCell>
                            <TableCell className="py-2 px-4 text-center">
                                {Number(schedule.clinicalHours) === 1 ? "AM Shift" :
                                    Number(schedule.clinicalHours) === 2 ? "PM Shift" :
                                        Number(schedule.clinicalHours) === 3 ? "Graveyard Shift" : null}
                            </TableCell>
                        </TableRow>
                    );
                })}
            </TableBody>
        </Table>
    )
}
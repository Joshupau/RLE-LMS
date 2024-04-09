import { db } from '@/lib/db';
import { format } from 'date-fns';

export const getAttendanceAbsencesTotalByMonth = async () => {
  try {
    const attendance = await db.userScheduling.findMany({});

    const attendanceByMonth = attendance.reduce((acc, day) => {
      const monthYear = format(new Date(day.date), 'yyyy-MM');
      if (!acc[monthYear]) {
        acc[monthYear] = { monthYear, attendance: 0, absences: 0, totalScheduled: 0 };
      }
      acc[monthYear].totalScheduled++; 
      if (day.timeIn && day.timeOut) {
        acc[monthYear].attendance++;
      } else {
        acc[monthYear].absences++;
      }
      return acc;
    }, {});

    const dataForChart = Object.values(attendanceByMonth).map(({ monthYear, attendance, absences, totalScheduled }) => ({
      x: monthYear,
      y: attendance,
      y2: absences,
      y3: totalScheduled 
    }));

    return dataForChart;

  } catch (error) {
    console.error("Error fetching attendance and absences by month:", error);
    throw error; 
  }
};

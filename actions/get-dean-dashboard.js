import { PrismaClient } from '@prisma/client';
import { format } from 'date-fns';

export const getAttendanceAbsencesTotalByMonth = async () => {
  try {
    const prisma = new PrismaClient();

    // Get attendance data
    const attendance = await prisma.userScheduling.findMany({
      include: {
        user: {
          
        }
      }
    });

    // Group attendance data by month
    const attendanceByMonth = attendance.reduce((acc, day) => {
      const monthYear = format(new Date(day.date), 'yyyy-MM');
      if (!acc[monthYear]) {
        acc[monthYear] = { monthYear, attendance: 0, absences: 0, totalScheduled: 0 };
      }
      acc[monthYear].totalScheduled++; // Increment total scheduled days
      if (day.timeIn && day.timeOut) {
        acc[monthYear].attendance++;
      } else {
        acc[monthYear].absences++;
      }
      return acc;
    }, {});

    // Format data for Nivo line chart
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

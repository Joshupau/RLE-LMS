import { PrismaClient } from '@prisma/client';

export const getAbsences = async (userId) => {
  try {
    const prisma = new PrismaClient();
    
    const currentDate = new Date(); // Get the current date

    const attendance = await prisma.userScheduling.findMany({
        where: {
            userId: userId,
        },
    });

    // Calculate the number of absences and filter out past dates
    let absences = 0;
    const filteredAttendance = attendance.filter(day => {
        if (new Date(day.date) < currentDate) {
            return false; // Filter out past dates
        }
        if (!day.timeIn || !day.timeOut) {
            absences++;
        }
        return true;
    });
            
    return { absences };

  } catch (error) {
    console.error("Error fetching absences:", error);
    throw error; 
  }
};

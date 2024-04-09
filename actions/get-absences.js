
import { db } from "@/lib/db";

export const getAbsences = async (userId) => {
  try {
    
    const currentDate = new Date(); 

    const attendance = await db.userScheduling.findMany({
        where: {
            userId: userId,
        },
    });

    let absences = 0;
    const filteredAttendance = attendance.filter(day => {
        if (new Date(day.date) < currentDate) {
            return false; 
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

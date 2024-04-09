import { db } from '@/lib/db';

export const getAttendance = async (userId) => {
  try {
    
    const attendance = await db.scheduling.findMany({
        where: {
            user: {
                some: {
                    id: userId
                }
            }
        },
        select: {
            week: true,
            userScheduling: {
                select: {
                    id: true,
                    date: true,
                    timeIn: true,
                    timeOut: true,
                    notes: true,
                    user: {
                        select:{
                            firstName: true,
                            lastName: true,
                            id: true,
                        }
                    }
                }
            }
        }
    });


            
    return attendance;

  } catch (error) {
    console.error("Error fetching attendance:", error);
    throw error; 
  }
};

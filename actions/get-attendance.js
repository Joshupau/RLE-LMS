import { db } from '@/lib/db';
import { getCurrentSchoolYear } from './get-current-school-year';

export const getAttendance = async (userId) => {
  try {
    
    const currentSchoolYear = await getCurrentSchoolYear();

    const attendance = await db.scheduling.findMany({
        where: {
            user: {
                some: {
                    id: userId
                }
            },
            schoolyearId: currentSchoolYear.id,
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

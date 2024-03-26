import { PrismaClient, UserRole } from '@prisma/client';

export const getAttendance = async (userId) => {
  try {
    const prisma = new PrismaClient();
    
    const attendance = await prisma.scheduling.findMany({
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
    console.error("Error fetching clinical instructors:", error);
    throw error; 
  }
};

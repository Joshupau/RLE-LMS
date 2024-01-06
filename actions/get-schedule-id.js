import { PrismaClient } from '@prisma/client';

export const getScheduleId = async (scheduleId) => {
    try {
      const prisma = new PrismaClient();
      const schedules = await prisma.scheduling.findUnique({
        where: {
            id: scheduleId,
        },
        include: {
          user: {
            select: {
              firstName: true,
              lastName: true,
              role: true,
            }
          }
        }
      });
  
      return schedules;
    } catch (error) {
      console.error("Error fetching schedule and users:", error);
      throw error;
    }
  };
  
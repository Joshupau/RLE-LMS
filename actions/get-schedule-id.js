import { db } from "@/lib/db";

export const getScheduleId = async (scheduleId) => {
    try {
      
      const schedules = await db.scheduling.findUnique({
        where: {
            id: scheduleId,
        },
        include: {
          user: {
            select: {
              firstName: true,
              lastName: true,
              role: true,
              id: true,
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
  
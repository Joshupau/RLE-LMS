import { db } from "@/lib/db";

export const getScheduleWithUsers = async () => {
  try {
    const schedulingData = await db.scheduling.findMany({
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            role: true,
          }
        },
        clinicalArea: true,
      }
    });
    

    return schedulingData;
  } catch (error) {
    console.error("Error fetching schedule and users:", error);
    throw error;
  }
};

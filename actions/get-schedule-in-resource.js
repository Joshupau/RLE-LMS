import { db } from "@/lib/db";

export const getScheduleInResource = async (resourceGroupId) => {
    try {
      const { scheduleId } = await db.resourceGroup.findUnique({
        where: { id: resourceGroupId}
      });

      const schedule = await db.scheduling.findUnique({
        where: { id: scheduleId },
        include: {
          clinicalArea: true,
        }
      },
    );

      return schedule


    } catch (error) {
      console.error("Error fetching schedule and users:", error);
      throw error;
    }
  };
  
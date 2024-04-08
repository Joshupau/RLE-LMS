import { PrismaClient } from '@prisma/client';

export const getScheduleInResource = async (resourceGroupId) => {
    try {
      const prisma = new PrismaClient();
      const { scheduleId } = await prisma.resourceGroup.findUnique({
        where: { id: resourceGroupId}
      });

      const schedule = await prisma.scheduling.findUnique({
        where: { id: scheduleId }
      });

      return schedule


    } catch (error) {
      console.error("Error fetching schedule and users:", error);
      throw error;
    }
  };
  
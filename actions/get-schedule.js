import { PrismaClient } from '@prisma/client';

export const getScheduleWithUsers = async () => {
  try {
    const prisma = new PrismaClient();
    const schedulingData = await prisma.scheduling.findMany({
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
    

    return schedulingData;
  } catch (error) {
    console.error("Error fetching schedule and users:", error);
    throw error;
  }
};

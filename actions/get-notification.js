import { PrismaClient, UserRole } from '@prisma/client';

export const getNotification = async (userId) => {
  try {
    const prisma = new PrismaClient();
 
    const Notification = await prisma.notification.findMany({
        where: {
            recipientId: userId,
        },
        orderBy: {
            createdAt: "desc",
        },
        take: 5,
    })

    return Notification;

  } catch (error) {
    console.error("Error fetching clinical instructors:", error);
    throw error; 
  }
};

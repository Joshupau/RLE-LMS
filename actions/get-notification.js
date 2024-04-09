import { db } from "@/lib/db";

export const getNotification = async (userId) => {
  try { 
    const Notification = await db.notification.findMany({
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

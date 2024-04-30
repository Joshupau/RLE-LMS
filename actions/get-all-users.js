import { db } from "@/lib/db";

export const getAllUsers = async () => {
  try {    
    const users = await db.user.findMany({
      orderBy: {
        yearLevel: 'asc'
      }
    });

    return users;

  } catch (error) {
    console.error("Error fetching absences:", error);
    throw error; 
  }
};

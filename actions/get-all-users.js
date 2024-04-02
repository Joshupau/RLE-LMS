import { PrismaClient } from '@prisma/client';

export const getAllUsers = async () => {
  try {
    const prisma = new PrismaClient();
    
    const users = await prisma.user.findMany();

    return users;

  } catch (error) {
    console.error("Error fetching absences:", error);
    throw error; 
  }
};

import { PrismaClient, UserRole } from '@prisma/client';

export const getStudent = async () => {
  try {
    const prisma = new PrismaClient();
    const students = await prisma.user.findMany({
      where: { role: UserRole.Student },
      orderBy: { yearLevel: "asc"}
    });

    return students;
  } catch (error) {
    console.error("Error fetching students:", error);
    throw error; 
  }
};

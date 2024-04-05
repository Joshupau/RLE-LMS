import { PrismaClient } from '@prisma/client';

export const getCurrentSchoolYear = async () => {
  try {
    const prisma = new PrismaClient();
    const currentSchoolYear = await prisma.schoolYear_Semester.findUnique({
      where: {
        current: true,
      },
    });

    return currentSchoolYear;
  } catch (error) {
    console.error("Error fetching current school year:", error);
    throw error;
  }
};

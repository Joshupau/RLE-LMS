import { PrismaClient } from '@prisma/client';

export const getCurrentSchoolYear = async () => {
  try {
    const prisma = new PrismaClient();
    const SchoolYear = await prisma.schoolYear_Semester.findMany({
      select: {
        id: true,
        schoolyear: true,
        semester: true,
        current: true,
      }
    });

    const currentSchoolYear = SchoolYear.find(year => year.current)

    return currentSchoolYear;
  } catch (error) {
    console.error("Error fetching current school year:", error);
    throw error;
  }
};

import { PrismaClient } from '@prisma/client';

export const getAllSchoolYear = async () => {
  try {
    const prisma = new PrismaClient();
    const schoolyear = await prisma.schoolYear_Semester.findMany({
        orderBy: [{ schoolyear: "asc" }, { semester: "asc" }]
    })


    return schoolyear;
  } catch (error) {
    console.error("Error fetching schoolyear:", error);
    throw error;
  }
};

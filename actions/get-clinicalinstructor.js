import { PrismaClient, UserRole } from '@prisma/client';

export const getClinicalInstructors = async () => {
  try {
    const prisma = new PrismaClient();
    const clinicalInstructors = await prisma.user.findMany({
      where: { role: UserRole.ClinicalInstructor },
    });

    return clinicalInstructors;
  } catch (error) {
    console.error("Error fetching clinical instructors:", error);
    throw error; 
  }
};

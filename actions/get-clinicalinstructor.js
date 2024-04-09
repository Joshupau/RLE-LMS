import {  UserRole } from '@prisma/client';
import { db } from '@/lib/db';

export const getClinicalInstructors = async () => {
  try {
    const clinicalInstructors = await db.user.findMany({
      where: { role: UserRole.ClinicalInstructor },
    });

    return clinicalInstructors;
  } catch (error) {
    console.error("Error fetching clinical instructors:", error);
    throw error; 
  }
};

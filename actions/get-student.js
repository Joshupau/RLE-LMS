import { UserRole } from '@prisma/client';
import { db } from '@/lib/db';


export const getStudent = async () => {
  try {
    const students = await db.user.findMany({
      where: { role: UserRole.Student },
      orderBy: [{ yearLevel: "asc" },{ lastName: "asc"}, { section: "asc" }]
    });

    return students;
  } catch (error) {
    console.error("Error fetching students:", error);
    throw error; 
  }
};

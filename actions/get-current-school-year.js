import { db } from "@/lib/db";

export const getCurrentSchoolYear = async () => {
  try {
    const SchoolYear = await db.schoolYear_Semester.findMany({
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

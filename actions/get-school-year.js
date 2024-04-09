import { db } from "@/lib/db";

export const getAllSchoolYear = async () => {
  try {

    const schoolyear = await db.schoolYear_Semester.findMany({
        orderBy: [{ schoolyear: "asc" }, { semester: "asc" }]
    })


    return schoolyear;
  } catch (error) {
    console.error("Error fetching schoolyear:", error);
    throw error;
  }
};

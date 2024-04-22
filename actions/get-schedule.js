import { db } from "@/lib/db";
import { getCurrentSchoolYear } from "./get-current-school-year";
import { UserRole } from "@prisma/client";

export const getScheduleWithUsers = async () => {
  try {

    const currentSchoolYear = await getCurrentSchoolYear();


    const schedulingData = await db.scheduling.findMany({
      where: {
        schoolyearId: currentSchoolYear.id
      },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            role: true,
          }
        },
        clinicalArea: true,
      },
      orderBy: [{ yearLevel: "asc"}, {groupId: "asc"}]
    });
    

    return schedulingData;
  } catch (error) {
    console.error("Error fetching schedule and users:", error);
    throw error;
  }
};

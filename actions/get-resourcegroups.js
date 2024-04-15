import { UserRole } from "@prisma/client";
import { db } from "@/lib/db";
import { getCurrentSchoolYear } from "./get-current-school-year";

export const getResourceGroup = async (userId) => {
    try {

        const currentSchoolYear = await getCurrentSchoolYear();


        const resources = await db.user.findUnique({
            where: {
                id: userId,
            },
            select: {
                resourceGroup: {
                    where: {
                        schoolyearId: currentSchoolYear.id,
                    },
                    select: {
                        name: true,
                        id: true,
                        users: {
                            where: {
                                role: UserRole.ClinicalInstructor,
                            },
                            select: {
                                firstName: true,
                                lastName: true,
                                id: true,
                            }
                        }
                    }
                }
            }
        });


        return resources;

    } catch (error) {
        console.error("Error in Prisma query:", error);

    }
}
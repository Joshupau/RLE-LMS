import {  UserRole } from "@prisma/client"
import { db } from "@/lib/db";
import { getCurrentSchoolYear } from "./get-current-school-year";

export const CISchedule = async (clinicalInstructorId) => {
    try {

        const currentSchoolYear = await getCurrentSchoolYear();

        const schedule = await db.user.findUnique({
            where: {
                id: clinicalInstructorId,
            },
            include: {
                schedules: {
                    where: {
                    schoolyearId: currentSchoolYear.id,
                    },
                    select: {
                        id: true,
                        groupId: true,
                        clinicalHours: true,
                        area: true,
                        yearLevel: true,
                        dateFrom: true,
                        dateTo: true,
                        week: true,
                        user: {
                            where:{
                                role: UserRole.Student,
                            },
                            select: {
                                firstName: true,
                                lastName: true,
                            }
                        },
                        clinicalArea: true,
                    }
                }
            }
        }
        );
               
        return schedule;

    } catch (error) {
        console.log(error);
    }

}
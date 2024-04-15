import { UserRole } from "@prisma/client"
import { db } from "@/lib/db";
import { getCurrentSchoolYear } from "./get-current-school-year";

export const studentSchedule = async (studentId) => {
    try {

        const currentSchoolYear = await getCurrentSchoolYear();

        const schedule = await db.scheduling.findMany({
            where: {
                user: {
                    some: {
                        id: studentId,
                    }
                },
                schoolyearId: currentSchoolYear.id,
            },
            include: {
                user: {
                    where: {
                        role: UserRole.ClinicalInstructor,
                    },
                    select: {
                        firstName: true,
                        lastName: true,
                    }
                },
                clinicalArea: true,
            }
        });

        // const schedule = await db.user.findUnique({
        //     where: {
        //         id: studentId,
        //     },
        //     include: {
        //         schedules: {
        //             select: {
        //                 id: true,
        //                 groupId: true,
        //                 clinicalHours: true,
        //                 area: true,
        //                 yearLevel: true,
        //                 dateFrom: true,
        //                 dateTo: true,
        //                 week: true,
        //                 user: {
        //                     where:{
        //                         role: UserRole.ClinicalInstructor,
        //                     },
        //                     select: {
        //                         firstName: true,
        //                         lastName: true,
        //                     },
        //                 },
        //                 clinicalArea: true,   
        //             }
        //         }
        //     }
        // }
        // );
               
        return schedule;

    } catch (error) {
        console.log(error);
    }

}
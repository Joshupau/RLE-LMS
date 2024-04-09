import { UserRole } from "@prisma/client"
import { db } from "@/lib/db";

export const studentSchedule = async (studentId) => {
    try {
        const schedule = await db.user.findUnique({
            where: {
                id: studentId,
            },
            include: {
                schedules: {
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
                                role: UserRole.ClinicalInstructor,
                            },
                            select: {
                                firstName: true,
                                lastName: true,
                            }
                        }
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
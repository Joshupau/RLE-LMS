import {  UserRole } from "@prisma/client"
import { db } from "@/lib/db";

export const CISchedule = async (clinicalInstructorId) => {
    
    try {
        const schedule = await db.user.findUnique({
            where: {
                id: clinicalInstructorId,
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
                                role: UserRole.Student,
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
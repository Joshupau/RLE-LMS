import { PrismaClient, UserRole } from "@prisma/client"


export const studentSchedule = async (studentId) => {
    
    try {
        const prisma = new PrismaClient();
        const schedule = await prisma.user.findUnique({
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
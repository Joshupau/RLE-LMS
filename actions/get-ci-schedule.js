import { PrismaClient, UserRole } from "@prisma/client"


export const CISchedule = async (clinicalInstructorId) => {
    
    try {
        const prisma = new PrismaClient();
        const schedule = await prisma.user.findUnique({
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
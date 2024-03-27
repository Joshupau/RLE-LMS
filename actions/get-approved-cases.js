import { PrismaClient } from "@prisma/client"


export const approvedCases = async (studentId) => {
    
    try {
        const prisma = new PrismaClient();
        const patientCases = await prisma.submissionOfPatientCases.findMany({
            where: {
                user: {
                    id: studentId,
                    status: true,
                }
            },
            include: {
                drCordCase: true,
                drMACase: true,
                medicalCase: true,
                orMajorMinorCase: true,
                chnCase: true,
                user: {
                    select: {
                        firstName: true,
                        lastName: true,
                    }
                }
            },
            orderBy: {
                createdAt: "desc",
            }
          });
          
               
        return patientCases;

    } catch (error) {
        console.log(error);
    }

}
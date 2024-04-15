import { db } from "@/lib/db";
import { Status } from "@prisma/client";

export const approvedCases = async (studentId) => {
    
    try {
        const patientCases = await db.submissionOfPatientCases.findMany({
            where: {
                user: {
                    id: studentId,
                },
                statusMigrate: Status.APPROVED,
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
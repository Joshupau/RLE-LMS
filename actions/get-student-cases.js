import { db } from "@/lib/db";

export const studentCases = async (studentId) => { 
    try {

        const patientCases = await db.submissionOfPatientCases.findMany({
            where: {
                user: {
                    id: studentId,
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
            }
          });
          
               
        return patientCases;

    } catch (error) {
        console.log(error);
    }

}
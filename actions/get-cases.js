import { db } from "@/lib/db";

export const CasesAssigned = async (clinicalInstructorId) => {
  try {

   const cases = await db.submissionOfPatientCases.findMany({
    where: {
        scheduling: {
            user: {
                some: {
                    id:clinicalInstructorId,
                }
            }
        }
    },
    include: {
        user: {
            select: {
                firstName: true,
                lastName: true,
            }
        },
        drCordCase: true,
        drMACase: true,
        orMajorMinorCase: true,
        medicalCase: true,
        chnCase: true,
    }
   });



    return cases;
  } catch (error) {
    console.error("Error fetching student cases:", error);
    throw error;
  }
};

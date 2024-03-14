import { PrismaClient, UserRole } from "@prisma/client";

export const CasesAssigned = async (clinicalInstructorId) => {
  try {
    const prisma = new PrismaClient();

   const cases = await prisma.submissionOfPatientCases.findMany({
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
        }
    }
   });



    return cases;
  } catch (error) {
    console.error("Error fetching student cases:", error);
    throw error;
  }
};

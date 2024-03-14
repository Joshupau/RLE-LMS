import { PrismaClient } from "@prisma/client";

export const getCase = async(id) => {
    try {
        const prisma = new PrismaClient();

        const Gcase = await prisma.submissionOfPatientCases.findUnique({
            where: {
                id: id,
            },
            include: {
                drCordCase: true,
                drMACase: true,
                orMajorMinorCase: true,
                chnCase: true,
                medicalCase: true,
            }
        });

        return Gcase;

    } catch (error) {
        
    }
}
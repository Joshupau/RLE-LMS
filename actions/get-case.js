import { db } from "@/lib/db";

export const getCase = async(id) => {
    try {

        const Gcase = await db.submissionOfPatientCases.findUnique({
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
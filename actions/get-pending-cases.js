import { PrismaClient } from "@prisma/client"


export const pendingCase = async (userId) => {
    
    try {
        const prisma = new PrismaClient();
        const pendingCase = await prisma.submissionOfPatientCases.findMany({
            where: {
                scheduling: {
                    user:{
                        some:{
                            id: userId
                        }
                    }
                },
                status: false,
            },
        })
        

        return pendingCase

    } catch (error) {
        console.log(error);
    }

}
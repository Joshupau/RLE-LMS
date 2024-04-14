import { db } from "@/lib/db";
import { Status } from "@prisma/client";

export const pendingCase = async (userId) => {
    
    try {
        const pendingCase = await db.submissionOfPatientCases.findMany({
            where: {
                statusMigrate: Status.PENDING,
                scheduling: {
                    user:{
                        some:{
                            id: userId
                        }
                    }
                },
            },
        })
        
        console.log(pendingCase);

        return pendingCase

    } catch (error) {
        console.log(error);
    }

}
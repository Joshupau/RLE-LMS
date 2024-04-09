import { db } from "@/lib/db";

export const pendingCase = async (userId) => {
    
    try {
        const pendingCase = await db.submissionOfPatientCases.findMany({
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
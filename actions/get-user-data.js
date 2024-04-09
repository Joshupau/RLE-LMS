import { db } from "@/lib/db";

export const getUserData = async (userId) => {
    try {

        const userData = await db.user.findUnique({
            where: { id: userId}
        })
        
        return userData
        
    } catch (error) {
    console.error("Error user data:", error);
    throw error; 
    }
}
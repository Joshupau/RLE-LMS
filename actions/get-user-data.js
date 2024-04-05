import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient();

export const getUserData = async (userId) => {
    try {

        const userData = await prisma.user.findUnique({
            where: { id: userId}
        })
        
        return userData
        
    } catch (error) {
    console.error("Error user data:", error);
    throw error; 
    }
}
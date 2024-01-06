import { PrismaClient, UserRole } from "@prisma/client";

export const getResources = async (userId) => {
    try {

        console.log("Received userId in getResources:", userId);

        const prisma = new PrismaClient();

        const resources = await prisma.user.findUnique({
            where: {
                id: userId,
            },
            select: {
                resourceGroup: {
                    select: {
                        name: true,
                        id: true,
                        users: {
                            where: {
                                role: UserRole.ClinicalInstructor,
                            }
                        }
                    }
                }
            }
        });

        return {resources};

    } catch (error) {
        console.error("Error in Prisma query:", error);

    }
}
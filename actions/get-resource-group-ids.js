
import { PrismaClient } from "@prisma/client";

export const getResourceGroupIds = async () => {
    try {
        const prisma = new PrismaClient();

        const resourceGroupIds = await prisma.resourceGroup.findMany({
            select: { id: true }, 
          });

        return resourceGroupIds;

    } catch (error) {
        console.error("Error in Prisma query:", error);

    }
}
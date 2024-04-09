import { db } from "@/lib/db";

export const getResourceGroupIds = async () => {
    try {

        const resourceGroupIds = await db.resourceGroup.findMany({
            select: { id: true }, 
          });

        return resourceGroupIds;

    } catch (error) {
        console.error("Error in Prisma query:", error);

    }
}
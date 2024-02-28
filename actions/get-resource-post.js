
import { PrismaClient } from "@prisma/client";

export const getResourcePosts = async (id) => {
    try {
        const prisma = new PrismaClient();


        const resourcePost = await prisma.resource.findMany({
            where: {
              resourceGroupId: id,
            },
            include: {
              author: {
                select: {
                  firstName: true,
                  middleName: true,
                  lastName: true,
                },
              },
            },
          });
        
        return resourcePost;

    } catch (error) {
        console.error("Error in Prisma query:", error);

    }
}
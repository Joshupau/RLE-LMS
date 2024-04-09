import { db } from "@/lib/db";

export const getResourcePosts = async (id) => {
    try {

        const resourcePost = await db.resource.findMany({
            where: {
              resourceGroupId: id,
            },
            include: {
              author: {
                select: {
                  firstName: true,
                  middleName: true,
                  lastName: true,
                  id:true,
                },
              },
            },
            orderBy: {
              createdAt: "desc",
            }
          });
        
        return resourcePost;

    } catch (error) {
        console.error("Error in Prisma query:", error);

    }
}
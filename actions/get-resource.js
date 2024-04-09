import {  UserRole } from "@prisma/client";
import { db } from "@/lib/db";

export const getResources = async (userId) => {
    try {

        const resources = await db.user.findUnique({
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
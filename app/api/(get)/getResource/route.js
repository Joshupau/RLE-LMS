import { NextResponse } from "next/server";
import { PrismaClient, UserRole } from "@prisma/client";

export async function GET(req) {
    try {
        const queryParams = req.nextUrl.searchParams;
        const userId = queryParams.get('userId');

        console.log(userId);

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
                            },
                            select: {
                                firstName: true,
                                lastName: true,
                                id: true,
                            }
                        }
                    }
                }
            }
        });
        
        return NextResponse.json(resources);
        
    } catch (error) {
        console.log("Failed to fetch Resources", error);
        return new NextResponse.json("Internal Error", { status: 500 });
    }
}
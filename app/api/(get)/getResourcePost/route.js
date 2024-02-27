import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";


export async function GET(request){
    try {
        const queryParams = request.nextUrl.searchParams;
        const resourceGroupId = queryParams.get('resourceGroupId');

        const prisma = new PrismaClient();


        const resourcePost = await prisma.resource.findMany({
            where: {
                resourceGroupId: resourceGroupId,
            },
            include: {
                author: {
                    select: {
                        firstName: true,
                        middleName: true,
                        lastName: true,
                    }
                }
            }
        });


        return NextResponse.json(resourcePost);
    } catch (error) {
        console.log("Failed to fetch Resource Posts", error);
        return new NextResponse.json("Internal Error", { status: 500 });
    }
}
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const body = await request.json();

    const { description, resourceGroupId, fileUrls, userId } = body;


    const schedulingId = await prisma.resourceGroup.findUnique({
      where: { id: resourceGroupId },
      select: { scheduleId: true },
    });

    // Create a new resource using Prisma
    const newResource = await prisma.resource.create({
      data: {
        description,
        uploadLinks: fileUrls,
        resourceGroup: {
          connect: {
            id: resourceGroupId,
          }
        },
        scheduling: {
          connect: {
            id: schedulingId.scheduleId
          }
        },
        author: {
          connect: {
            id: userId
          }
        },
      },
    });

    // Respond with success message

    return NextResponse.json({ status: 201 }, newResource);
  } catch (error) {
    console.error('Error storing resource:', error);
    return NextResponse.json({ status: 500 }, "Internal server error");
  }
}

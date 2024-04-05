import { PrismaClient, UserRole } from "@prisma/client";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";
import { getCurrentSchoolYear } from "@/actions/get-current-school-year";

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const body = await request.json();

    const session = await getServerSession(authOptions);

    if(!session){
      return NextResponse.json({ status: 401 }, "Unauthorized Error");

    }
    const userId = session.token.id;


    const { description, resourceGroupId, fileUrls } = body;


    const schedulingId = await prisma.resourceGroup.findUnique({
      where: { id: resourceGroupId },
      select: { scheduleId: true },
    });

    const schoolyear = await getCurrentSchoolYear();
    // Create a new resource using Prisma
    const newResource = await prisma.resource.create({
      data: {
        description,
        uploadLinks: fileUrls,
        schedulingId: schoolyear.id,
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

    const userIds = await prisma.resourceGroup.findUnique({
      where: { id: resourceGroupId },
      select: { 
        users: {
          where: {
            role: { in: [UserRole.Student, UserRole.ClinicalInstructor] }
          },
          select: {
            id: true,
          }
        }
      }
    });
    

    const author = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        firstName: true,
        lastName: true,
      }
    })

    for (const userRecord of userIds.users){
      try {
        const studentId = userRecord.id;

        if (studentId === userId) {
          console.warn(`Skipping author ${studentId}`);
          continue; 
        }

        await prisma.notification.create({
          data: {
              title: "Resource Notification",
              message: `New Resource Post uploaded by ${author.firstName} ${author.lastName}.`,
              recipientId: studentId, 
              type: "general", 
              link: `/resources/${resourceGroupId}`,
              expiresAt: new Date(Date.now() + (14 * 24 * 60 * 60 * 1000)), 
            },
      });
        
      } catch (error) {
        console.error(`Error creating UserScheduling for student ${userRecord.id}:`, error);
      }
    }

    return NextResponse.json({ status: 201 }, newResource);
  } catch (error) {
    console.error('Error storing resource:', error);
    return NextResponse.json({ status: 500 }, "Internal server error");
  }
}

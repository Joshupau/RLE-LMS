import { AuditAction } from "@prisma/client";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";
import { db } from "@/lib/db";
import { createAuditLog } from "@/lib/create-audit-log";

export async function POST(request) {
  try {
    const body = await request.json();

    const session = await getServerSession(authOptions);

    if(!session){
      return NextResponse.json({ status: 401 }, "Unauthorized Error");

    }
    const userId = session.token.id;

    const { description, resourceGroupId, fileUrls, userIds, schoolyear, schedulingId } = body;

    const newResource = await db.resource.create({
      data: {
        description,
        uploadLinks: fileUrls,
        schoolyear: {
          connect:{
            id: schoolyear.id,
          }
        },
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
    await createAuditLog({
      entityId: newResource.id,
      Action: AuditAction.CREATE,
      Title: "Resource Post.",
    })

        

    const author = await db.user.findUnique({
      where: { id: userId },
      select: {
        firstName: true,
        lastName: true,
      }
    })

    for (const userRecord of userIds.users){
      try {
        const studentId = userRecord.id;

        await db.notification.create({
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

import { createAuditLog } from "@/lib/create-audit-log";
import { db } from "@/lib/db";
import { AuditAction } from "@prisma/client";
import { NextResponse } from "next/server";


export async function POST(request) {
    try {
    const body = await request.json();
        
    const {          
        fileUrls,
        description,
        userId,
        id,
        uploadUrl,
     } = body;

     const combinedLinks = [...fileUrls, ...uploadUrl];
     const updateResource = await db.resource.update({
        where: {
            id: id,
            author: {
                id: userId,
            }
        },
        data: {
            description: description,
            uploadLinks: combinedLinks,
        }
     });
     
     await createAuditLog({
      entityId: updateResource.id,
      Action: AuditAction.UPDATE,
      Title: "Resource Post Update.",
    });

    return NextResponse.json({ status: 201 }, updateResource);
  } catch (error) {
    console.error('Error storing resource:', error);
    return NextResponse.json({ status: 500 }, "Internal server error");
  }
}

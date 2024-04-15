
import { createAuditLog } from "@/lib/create-audit-log";
import { db } from "@/lib/db";
import { AuditAction, Status } from "@prisma/client";
import { NextResponse } from "next/server";

export async function POST(req,res) {
    try {
        const body = await req.json();

        const {
            id,
        } = body;
        
        if(!id){
            return NextResponse.json({ error: "Missing Fields" }, { status: 400 }); 
        }


        const approve = await db.submissionOfPatientCases.update({
            where: {
                id: id,
            },
            data: {
                statusMigrate: Status.APPROVED,
            }
        });
        const notification = await db.notification.create({
            data: {
              title: "Case Notification",
              message: `Your ${approve.caseType} case has been approved.`,
              recipientId: approve.userId, 
              type: "general", 
              link: `/progress/student`,
              expiresAt: new Date(Date.now() + (14 * 24 * 60 * 60 * 1000)), 
            },
          });

          await createAuditLog({
            entityId: approve.id,
            Action: AuditAction.UPDATE,
            Title: "Case Approved.",
          });


        return NextResponse.json(approve, notification);
    } catch (error) {
        console.error("Error Updating Case:", error);
        return NextResponse.json({ error: "Internal Server Error" },{ status: 500 });
        }
}
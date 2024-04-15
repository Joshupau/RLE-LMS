
import { createAuditLog } from "@/lib/create-audit-log";
import { db } from "@/lib/db";
import { AuditAction } from "@prisma/client";
import { NextResponse } from "next/server";

export async function DELETE(req) {
    if(!req.method === 'DELETE'){
        return NextResponse.json({ status: 500 }, "Internal server error");
    
      }
    try {
        const body = await req.json();
        const {
            id,
        } = body;
        
        
        if(!id){
            return NextResponse.json({ error: "Missing Fields" }, { status: 400 }); 
        }


        const deleted = await db.submissionOfPatientCases.delete({
            where: {
                id: id,
            }
        });

        await createAuditLog({
            entityId: deleted.id,
            Action: AuditAction.DELETE,
            Title: "Case Delete.",
          });

        return NextResponse.json(deleted);
    } catch (error) {
        console.error("Error Updating Case:", error);
        return NextResponse.json({ error: "Internal Server Error" },{ status: 500 });
        }
}
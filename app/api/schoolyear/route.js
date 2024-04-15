import { createAuditLog } from "@/lib/create-audit-log";
import { db } from "@/lib/db";
import { AuditAction } from "@prisma/client";
import { NextResponse } from "next/server";

export async function POST(req, res){
    try {
        
        const body = await req.json()

        const {
            schoolyear,
            semester,
        } = body;

        const Newschoolyear = await db.schoolYear_Semester.create({
            data: {
                schoolyear: schoolyear,
                semester: semester,
            }
        });

        await createAuditLog({
            entityId: Newschoolyear.id,
            Action: AuditAction.CREATE,
            Title: "New School Year.",
          });


        return NextResponse.json(Newschoolyear)

    } catch (error) {
        console.error("Error creating school year:", error);
        return NextResponse.json(
          { error: "Internal Server Error" },
          { status: 500 }
        );
    }
} 
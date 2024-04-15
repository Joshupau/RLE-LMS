import { createAuditLog } from "@/lib/create-audit-log";
import { db } from "@/lib/db";
import { AuditAction } from "@prisma/client";
import { NextResponse } from "next/server";

export async function POST(req, res) {
try {
    const { createArea } = await req.json();

    if(!createArea){
    return NextResponse.json({ error: "Missing Fields" }, { status: 400 });
    }

    const clinicalArea = await db.area.create({
        data: {
            name: createArea,
        }
    });

    await createAuditLog({
        entityId: clinicalArea.id,
        Action: AuditAction.CREATE,
        Title: "Clinical Area Creation.",
      })


    return NextResponse.json({ status: 200}, { message: "Success"});

} catch (error) {
    console.error("Error creating Clinical Area:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
}
}
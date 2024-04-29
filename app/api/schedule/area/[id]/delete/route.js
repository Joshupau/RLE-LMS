import { NextResponse } from 'next/server';

import { db } from '@/lib/db';
import { createAuditLog } from '@/lib/create-audit-log';
import { AuditAction } from '@prisma/client';

export async function DELETE(req,{ params}) {
  try {

    const { id } = params

    const deletedArea = await db.area.delete({
      where: { id },
    });

    if (!deletedArea) {
      return new NextResponse.json("Clinical Area not found", { status: 404 });
    }

    await db.userScheduling.deleteMany({
      where: { schedulingId: id },
    });

    await createAuditLog({
      entityId: deletedArea.id,
      Action: AuditAction.DELETE,
      Title: "Clinical Area Delete.",
    })

    return NextResponse.json(deletedArea);
  } catch (error) {
    console.error("[CLINICALAREA_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  } 
}

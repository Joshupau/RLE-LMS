import { NextResponse } from 'next/server';

import { db } from '@/lib/db';
import { createAuditLog } from '@/lib/create-audit-log';
import { AuditAction } from '@prisma/client';

export async function DELETE(req, res) {
  try {
    const url = new URL(req.url);
    const searchparams = new URLSearchParams(url.searchParams);
    const id = searchparams.get('id');

    const deletedSchedule = await db.scheduling.delete({
      where: { id },
    });

    if (!deletedSchedule) {
      return new NextResponse.json("Schedule not found", { status: 404 });
    }

    await db.userScheduling.deleteMany({
      where: { schedulingId: id },
    });

    await createAuditLog({
      entityId: deletedSchedule.id,
      Action: AuditAction.DELETE,
      Title: "Schedule Delete.",
    })

    return NextResponse.json(deletedSchedule);
  } catch (error) {
    console.error("[SCHEDULE_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  } 
}

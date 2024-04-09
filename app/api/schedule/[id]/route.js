import { NextResponse } from 'next/server';

import { db } from '@/lib/db';

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
    const userSchedulings = await db.userScheduling.findMany({
      where: { schedulingId: id },
    });

    for (const userScheduling of userSchedulings) {
      await db.userScheduling.delete({
        where: { id: userScheduling.id },
      });
    }
    

    return NextResponse.json(deletedSchedule);
} catch (error) {
    console.log("[SCHEDULE_DELETE]", error)
    return new NextResponse("Internal Error", { status: 500 });
} 
}

import { NextResponse } from 'next/server';

import { PrismaClient } from '@prisma/client';


export async function DELETE(req, res) {
  const prisma = new PrismaClient();

  try {
    const url = new URL(req.url);
    const searchparams = new URLSearchParams(url.searchParams);
    const id = searchparams.get('id');


    const deletedSchedule = await prisma.scheduling.delete({
      where: { id },
    });

    if (!deletedSchedule) {
        return new NextResponse.json("Schedule not found", { status: 404 });
    }
    const userSchedulings = await prisma.userScheduling.findMany({
      where: { schedulingId: id },
    });

    for (const userScheduling of userSchedulings) {
      await prisma.userScheduling.delete({
        where: { id: userScheduling.id },
      });
    }
    

    return NextResponse.json(deletedSchedule);
} catch (error) {
    console.log("[SCHEDULE_DELETE]", error)
    return new NextResponse("Internal Error", { status: 500 });
} finally {
    await prisma.$disconnect();
  }
}

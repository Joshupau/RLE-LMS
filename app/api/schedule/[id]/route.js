import { NextResponse } from 'next/server';

import { PrismaClient } from '@prisma/client';


export async function DELETE(req, res) {
  const prisma = new PrismaClient();

  try {
    const queryParams = req.nextUrl.searchParams;
    const id = queryParams.get('id');


    const deletedSchedule = await prisma.scheduling.delete({
      where: { id },
    });

    if (!deletedSchedule) {
        return new NextResponse.json("Schedule not found", { status: 404 });
    }

    return NextResponse.json(deletedSchedule);
} catch (error) {
    console.log("[SCHEDULE_DELETE]", error)
    return new NextResponse("Internal Error", { status: 500 });
} finally {
    await prisma.$disconnect();
  }
}

import { NextResponse } from 'next/server';

import { db } from '@/lib/db';
export async function POST(req) {
  try {

    const { ids } = await req.json();


    const reactivateUsers = await db.user.updateMany({
        where: {
          id: { in: ids },
        },
        data: {
          status: true,
        },
      });

    return NextResponse.json(reactivateUsers);
  } catch (error) {
    console.error("[SCHEDULE_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  } 
}

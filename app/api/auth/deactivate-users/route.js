import { NextResponse } from 'next/server';

import { db } from '@/lib/db';
export async function POST(req) {
  try {

    const { ids } = await req.json();


    const deactivateUsers = await db.user.updateMany({
        where: {
          id: { in: ids },
        },
        data: {
          status: false,
        },
      });

    return NextResponse.json(deactivateUsers);
  } catch (error) {
    console.error("[SCHEDULE_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  } 
}

import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

export async function POST(req ) {

    const { userId, newPassword} = await req.json();
  try {
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const UpdatedPassword = await db.user.update({
        where: { id: userId },
        data: {
            hashedPassword: hashedPassword,
        }
    })

    return NextResponse.json(UpdatedPassword);  
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json({ error: "INTERNAL ERROR " }, { status: 500 });  
  }
}

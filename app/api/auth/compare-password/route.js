import { NextResponse } from "next/server";
import bcrypt from "bcrypt";


export async function POST(req) {
    try {
    const { oldPassword, hashedPassword } = await req.json();
    
    console.log(oldPassword, hashedPassword)
    const isOldPasswordCorrect = await bcrypt.compare(oldPassword, hashedPassword);

    return NextResponse.json({ isOldPasswordCorrect });
  } catch (error) {
    console.error("Error comparing passwords:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

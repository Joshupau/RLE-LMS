// api/auth/update-user.js
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { signIn } from "next-auth/react";

const prisma = new PrismaClient();

export async function POST(req, res) {
//   if (!req.headers.authorization) {
//     return NextResponse.json({ error: "Missing " }, { status: 401 });  
//     }

  const updatedData = await req.json();
  const {
    firstName,
    middleName,
    lastName,
    age,
    email,
    id,
  } = updatedData
  try {
    const updatedUser = await prisma.user.update({
      where: { id: id }, // Use verified user ID
      data: {
        firstName: firstName,
        middleName: middleName,
        lastName: lastName,
        age: Number(age),
        email: email,
      },
    });


    return NextResponse.json(updatedUser);  
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json({ error: "INTERNAL ERROR " }, { status: 500 });  
  }
}

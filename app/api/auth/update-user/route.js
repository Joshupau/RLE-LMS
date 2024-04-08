import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(req, ) {

  const updatedData = await req.json();

  const {
    firstName,
    middleName,
    lastName,
    age,
    email,
    id,
    contact
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
        contact: Number(contact),
      },
    });


    return NextResponse.json(updatedUser);  
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json({ error: "INTERNAL ERROR " }, { status: 500 });  
  }
}

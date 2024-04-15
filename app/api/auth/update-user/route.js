import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req) {
  const updatedData = await req.json();

  const {
    firstName,
    middleName,
    lastName,
    age,
    email,
    id,
    contact,
    schoolId,
    section,
    group,
    status,
    role,
  } = updatedData;

  // Convert the status string to a boolean
  const booleanStatus = status === "true";

  try {
    const updatedUser = await db.user.update({
      where: { id: id },
      data: {
        firstName: firstName,
        middleName: middleName,
        lastName: lastName,
        age: Number(age),
        email: email,
        contact: Number(contact),
        status: booleanStatus, // Use the converted boolean value
        role: role,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json({ error: "INTERNAL ERROR " }, { status: 500 });
  }
}

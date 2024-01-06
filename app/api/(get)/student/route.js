import { getStudent } from "@/actions/get-student";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const students = await getStudent();
    
    return NextResponse.json(students);
  } catch (error) {
    console.error("Failed to fetch students", { error });
    return NextResponse.json({ message: "Could not retrieve students.", error }, {
      status: 500,
    });
  }
}

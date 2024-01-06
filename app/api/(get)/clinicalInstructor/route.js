import { getClinicalInstructors } from "@/actions/get-clinicalinstructor";

import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const clinicalInstructor = await getClinicalInstructors();
    
    return NextResponse.json(clinicalInstructor);
  } catch (error) {
    console.error("Failed to fetch clinical instructor", { error });
    return NextResponse.json({ message: "Could not retrieve students.", error }, {
      status: 500,
    });
  }
}

import { getScheduleWithUsers } from "@/actions/get-schedule";
import { NextResponse } from "next/server";


export async function GET(request) {
  try {
    const schedule = await getScheduleWithUsers();
    
    return NextResponse.json(schedule);
  } catch (error) {
    console.error("Failed to fetch schedule", { error });
    return NextResponse.json({ message: "Could not retrieve schedule.", error }, {
      status: 500,
    });
  }
}

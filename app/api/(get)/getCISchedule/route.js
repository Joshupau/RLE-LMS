import { CISchedule } from "@/actions/get-ci-schedule";
import { NextResponse } from "next/server";

export async function GET(req) {
    try {
        const queryParams = req.nextUrl.searchParams;
        const clinicalInstructorId = queryParams.get('clinicalInstructorId');


        const schedule = await CISchedule(clinicalInstructorId);

        return NextResponse.json(schedule);
    } catch (error) {
        console.error("Error fetching schedule:", error);

        return NextResponse.json({ message: "Could not retrieve schedule.", error }, {
            status: 500,
        });
    }
}

import { studentSchedule } from "@/actions/get-student-schedule";
import { NextResponse } from "next/server";

export async function GET(req, res) {
    try {
        const queryParams = req.nextUrl.searchParams;
        const studentId = queryParams.get('studentId');


        const schedule = await studentSchedule(studentId);

        return NextResponse.json(schedule);
    } catch (error) {
        console.error("Error fetching schedule:", error);

        return NextResponse.json({ message: "Could not retrieve schedule.", error }, {
            status: 500,
        });
    }
}

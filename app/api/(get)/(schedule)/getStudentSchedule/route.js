import { studentSchedule } from "@/actions/get-student-schedule";
import { NextResponse } from "next/server";

export async function GET(req, res) {
    try {
        const url = new URL(req.url);
        const searchparams = new URLSearchParams(url.searchParams);
        const studentId = searchparams.get("studentId");


        const schedule = await studentSchedule(studentId);

        return NextResponse.json(schedule);
    } catch (error) {
        console.error("Error fetching schedule:", error);

        return NextResponse.json({ message: "Could not retrieve schedule.", error }, {
            status: 500,
        });
    }
}

import { getScheduleId } from "@/actions/get-schedule-id";
import { NextResponse } from "next/server";

export async function GET(req, res) {
    try {
        const url = new URL(req.url);
        const searchparams = new URLSearchParams(url.searchParams);
        const id = searchparams.get('id');


        const schedule = await getScheduleId(id);

        return NextResponse.json(schedule);
    } catch (error) {
        console.error("Error fetching schedule:", error);

        return NextResponse.json({ message: "Could not retrieve schedule.", error }, {
            status: 500,
        });
    }
}

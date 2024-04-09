import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req, res) {
    try {
        const body = await req.json();
        const { schoolyearId } = body;

        await db.schoolYear_Semester.updateMany({
            where: {
                id: {
                    not: schoolyearId
                }
            },
            data: {
                current: false
            }
        });

        await db.schoolYear_Semester.update({
            where: {
                id: schoolyearId
            },
            data: {
                current: true
            }
        });

        return NextResponse.json({ message: "School year updated successfully" });
    } catch (error) {
        console.error("Error updating school year:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}

import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(req, res) {
    try {
        const body = await req.json();
        const { schoolyearId } = body;

        await prisma.schoolYear_Semester.updateMany({
            where: {
                id: {
                    not: schoolyearId
                }
            },
            data: {
                current: false
            }
        });

        await prisma.schoolYear_Semester.update({
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

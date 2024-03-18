
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(req,res) {
    try {
        const body = await req.json();

        const {
            id,
            status
        } = body;
        
        const approve = await prisma.submissionOfPatientCases.update({
            where: {
                id: id,
            },
            data: {
                status: status,
            }
        });

        return NextResponse.json(approve);
    } catch (error) {
        console.error("Error Updating Case:", error);
        return NextResponse.json({ error: "Internal Server Error" },{ status: 500 });
        }
}
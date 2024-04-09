import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req, res) {
try {
    const { createArea } = await req.json();

    if(!createArea){
    return NextResponse.json({ error: "Missing Fields" }, { status: 400 });
    }

    const clinicalArea = await db.area.create({
        data: {
            name: createArea,
        }
    });


    return NextResponse.json({ status: 200}, { message: "Success"});

} catch (error) {
    console.error("Error creating Clinical Area:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
}
}
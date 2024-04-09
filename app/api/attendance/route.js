
import { db } from "@/lib/db";
import { NextResponse } from "next/server";


export async function POST(req,res) {
    try {
        const body = await req.json();

        const {
            studentData,
            date
        } = body;

        const newDate = new Date(date);
        const dateParts = newDate.toISOString().split('T')[0];

        
        for (const student of studentData) {

            const combinedtimeIn = `${dateParts}T${student.timeIn}:00.000Z`
            const combinedtimeOut = `${dateParts}T${student.timeOut}:00.000Z`

            const timeIn = new Date(combinedtimeIn);
            const timeOut = new Date(combinedtimeOut);

            if (!student.timeIn && !student.timeOut) {
              console.warn(`Skipping student ${student.id}: Missing timeIn or timeOut`);
              continue; 
            }
           const update = await db.userScheduling.update({
              where: {
                id: student.id,
              },
              data: {
                timeIn: student.timeIn ? timeIn : null,
                timeOut: student.timeOut ? timeOut : null,
                notes: student.remark
              }
            });

            if(!update){
              return NextResponse.json({ error: "Internal Server Error/Failed to store" },{ status: 500 });
            }
            
        }
        return NextResponse.json({message: "Attendance updated successfully"}, {status: 200});
    } catch (error) {
        console.error("Error Updating Attendance:", error);
        return NextResponse.json({ error: "Internal Server Error" },{ status: 500 });
    }
}
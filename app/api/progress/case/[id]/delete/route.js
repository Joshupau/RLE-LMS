
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function DELETE(req) {
    if(!req.method === 'DELETE'){
        return NextResponse.json({ status: 500 }, "Internal server error");
    
      }
    try {
        const body = await req.json();
        const {
            id,
        } = body;
        
        console.log(body);
        
        if(!id){
            return NextResponse.json({ error: "Missing Fields" }, { status: 400 }); 
        }


        const deleted = await db.submissionOfPatientCases.delete({
            where: {
                id: id,
            }
        })

        return NextResponse.json(deleted);
    } catch (error) {
        console.error("Error Updating Case:", error);
        return NextResponse.json({ error: "Internal Server Error" },{ status: 500 });
        }
}
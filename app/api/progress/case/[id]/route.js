
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req,res) {
    try {
        const body = await req.json();

        const {
            id,
            status
        } = body;
        
        if(!id){
            return NextResponse.json({ error: "Missing Fields" }, { status: 400 }); 
        }


        const approve = await db.submissionOfPatientCases.update({
            where: {
                id: id,
            },
            data: {
                status: status ? false : true,
            }
        });
        const notification = await db.notification.create({
            data: {
              title: "Case Notification",
              message: `Your case ${approve.caseType} has been ${approve.status ? 'approved' : 'disapproved'}`,
              recipientId: approve.userId, 
              type: "general", 
              link: `/progress/student`,
              expiresAt: new Date(Date.now() + (14 * 24 * 60 * 60 * 1000)), 
            },
          });


        return NextResponse.json(approve, notification);
    } catch (error) {
        console.error("Error Updating Case:", error);
        return NextResponse.json({ error: "Internal Server Error" },{ status: 500 });
        }
}
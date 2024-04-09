
import { db } from "@/lib/db";
import { NextResponse } from "next/server";


export async function POST(req,res) {
    try {
        const body = await req.json();

        const {
            notification,
            status
        } = body;
        
        if(!notification || !status){
            return NextResponse.json({ error: "Missing Fields" }, { status: 400 }); 
        }

        for(const notif of notification){
            await db.notification.update({
                where: {
                    id: notif.id,
                },
                data: {
                    isRead: status,
                },
            });
        }


        return NextResponse.json({status: 200}, {message: "Notfication read!"});
    } catch (error) {
        console.error("Error Updating Case:", error);
        return NextResponse.json({ error: "Internal Server Error" },{ status: 500 });
        }
}
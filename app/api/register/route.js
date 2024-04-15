import bcrypt from "bcrypt";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { createAuditLog } from "@/lib/create-audit-log";
import { AuditAction } from "@prisma/client";

export async function POST(request){
    try {
        const body = await request.json();
        const { firstName, middleName, lastName, schoolId, age, email, password, role, yearLevel, section, group } = body;
    
        if(!firstName || !lastName || !schoolId || !age || !email || !password) {
            return new NextResponse({ error: "Missing fields" }, { status: 400 });
        }
    
        const exist = await db.user.findUnique({
            where: {
                email: email,
                schoolId: Number(schoolId),
            }
        });

        if (password.length < 8) {
            return new NextResponse({ error: "Password must be at least 8 characters long" }, { status: 400 });
        }
    
        if(exist) {
            return new NextResponse({ error: "User exists" }, { status: 400 });
        }
    
        const hashedPassword = await bcrypt.hash(password, 10);
    
        const user = await db.user.create({
            data: {
                firstName,
                middleName,
                lastName,
                schoolId: Number(schoolId),
                age: Number(age),
                email,
                hashedPassword,
                role,
                yearLevel: Number(yearLevel),
                group,
                section,
                status: true,
            }
        });

        await createAuditLog({
            entityId: user.id,
            Action: AuditAction.CREATE,
            Title: "New user created.",
          });
    
        return NextResponse.json(user);
    } catch (error) {
        console.log("[REGISTER]", error);
        return new NextResponse({ error: "Internal Error" }, { status: 500 });
    }
}
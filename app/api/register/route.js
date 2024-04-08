import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(request){
    try {
        const body = await request.json();
        const { firstName, middleName, lastName, schoolId, age, email, password } = body;
    
        if(!firstName || !lastName || !schoolId || !age || !email || !password) {
            return new NextResponse({ error: "Missing fields" }, { status: 400 });
        }
    
        const exist = await prisma.user.findUnique({
            where: {
                email: email,
                schoolId: schoolId,
            }
        });

        if (password.length < 8) {
            return new NextResponse({ error: "Password must be at least 8 characters long" }, { status: 400 });
        }
    
        if(exist) {
            return new NextResponse({ error: "User exists" }, { status: 400 });
        }
    
        const hashedPassword = await bcrypt.hash(password, 10);
    
        const user = await prisma.user.create({
            data: {
                firstName,
                middleName,
                lastName,
                schoolId,
                age,
                email,
                hashedPassword,
                status: true,
            }
        });
    
        return NextResponse.json(user);
    
    } catch (error) {
        console.log("[REGISTER]", error);
        return new NextResponse({ error: "Internal Error" }, { status: 500 });
    }
}
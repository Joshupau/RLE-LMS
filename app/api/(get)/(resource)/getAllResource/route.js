import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";


export async function GET(request) {
  try {
    const prisma = new PrismaClient();
    const resourceGroup = await prisma.resourceGroup.findMany();
    
    return NextResponse.json(resourceGroup);
  } catch (error) {
    console.error("Failed to fetch schedule", { error });
    return NextResponse.json({ message: "Could not retrieve schedule.", error }, {
      status: 500,
    });
  }
}

import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      scheduleId,
      clinicalInstructor,
      clinicalHours,
      dateFrom,
      dateTo,
      userId,
      area,
      group,
      yearLevel,
      students,
      week,
    } = body;

    if (
      !clinicalInstructor ||
      !clinicalHours ||
      !area ||
      !group ||
      !yearLevel ||
      !students ||
      !week 
    ) {
      return NextResponse.json({ error: "Missing Fields" }, { status: 400 });
    }

    const combinedUsers = [...students, clinicalInstructor[0], userId];

    const existingUsers = await prisma.user.findMany({
      where: { id: { in: combinedUsers } },
    });

    if (existingUsers.length !== combinedUsers.length) {
      return NextResponse.json({ error: "Invalid user IDs" }, { status: 400 });
    }

    const dateFromArray = dateFrom.map((date) => new Date(date));
    const dateToArray = dateTo.map((date) => new Date(date));

    const schedules = await prisma.scheduling.update({
        where:{
            id: scheduleId,
        },
      data: {
        clinicalHours,
        dateFrom: dateFromArray,
        dateTo: dateToArray,
        groupId: group,
        yearLevel: yearLevel,
        area: area,
        week: week,
        user: {
          connect: combinedUsers.map((userId) => ({ id: userId })),
        },
      },
      include: {
        user: true,
      }
    });

    const sanitizedSchedules = {
        id: schedules.id,
        clinicalHours: schedules.clinicalHours,
        dateFrom: schedules.dateFrom,
        dateTo: schedules.dateTo,
        groupId: schedules.groupId,
        yearLevel: schedules.yearLevel,
        area: schedules.area,
        users: schedules.user, // Include the associated users in the response
      };

    return NextResponse.json(sanitizedSchedules);
  } catch (error) {
    console.error("Error creating schedule:", error);
    return NextResponse.json({ error: "Internal Server Error" },{ status: 500 });
  }
}

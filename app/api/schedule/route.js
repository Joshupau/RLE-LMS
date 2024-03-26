import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const body = await request.json();

    const {
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
      dates,
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

    const combinedUsers = [...students, clinicalInstructor, userId];

    const existingUsers = await prisma.user.findMany({
      where: { id: { in: combinedUsers } },
    });

    if (existingUsers.length !== combinedUsers.length) {
      return NextResponse.json({ error: "Invalid user IDs" }, { status: 400 });
    }

    const dateFromArray = dateFrom.map((date) => new Date(date));
    const dateToArray = dateTo.map((date) => new Date(date));

    const schedules = await prisma.scheduling.create({
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

    const resourceGroup = await prisma.resourceGroup.create({
      data: {
        name: schedules.week,
        users: {
          connect: schedules.user.map((user) => ({ id: user.id })),
        },
        schedule: {
          connect: { id: schedules.id },
        },
      },
    });

        const recipientIds = [...students, clinicalInstructor];

        for (const userId of recipientIds) {
             await prisma.notification.create({
              data: {
                  title: "Schedule Notification",
                  message: `RLE schedule for Week/s ${week}.`,
                  recipientId: userId, // Store the ID of each recipient
                  type: "general", 
                  link: `/schedule/${schedules.id}`,
                  expiresAt: new Date(Date.now() + (14 * 24 * 60 * 60 * 1000)), 
                },
          });
        }


    for (const studentId of students) {
      try {
        // Iterate over each date in the dates array
        for (const date of dates) {
          await prisma.userScheduling.create({
            data: {
              userId: studentId,
              schedulingId: schedules.id,
              date: date, 
              week: week, 
            },
          });
        }
      } catch (error) {
        console.error(`Error creating UserScheduling for student ${studentId}:`, error);
      }
    }
    

    const sanitizedSchedules = {
      id: schedules.id,
      clinicalHours: schedules.clinicalHours,
      dateFrom: schedules.dateFrom,
      dateTo: schedules.dateTo,
      groupId: schedules.groupId,
      yearLevel: schedules.yearLevel,
      area: schedules.area,
      users: schedules.users, // Include the associated users in the response
    };


    return NextResponse.json(sanitizedSchedules, resourceGroup);
  } catch (error) {
    console.error("Error creating schedule:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

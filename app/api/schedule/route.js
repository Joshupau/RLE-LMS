import { getCurrentSchoolYear } from "@/actions/get-current-school-year";
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
    const dateFromArray = dateFrom.map((date) => new Date(date));
    const dateToArray = dateTo.map((date) => new Date(date));

    const combinedUsers = [...students, clinicalInstructor, userId];
    const recipientIds = [...students, clinicalInstructor];

    const schoolyear = await getCurrentSchoolYear();

    
    const schedules = await prisma.scheduling.create({
      data: {
        clinicalHours,
        dateFrom: dateFromArray,
        dateTo: dateToArray,
        groupId: group,
        yearLevel: yearLevel,
        area: area,
        week: week,
        schoolyearId: schoolyear.id,
        user: {
          connect: combinedUsers.map((userId) => ({ id: userId })),
        },
      },
      include: {
        user: true,
      },
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

    const notificationPromises = students.map((userId) =>
      prisma.notification.create({
        data: {
          title: "Schedule Notification",
          message: `RLE schedule for Week/s ${week}.`,
          recipientId: userId,
          type: "general",
          link: `/schedule`,
          expiresAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        },
      })
    );
    
    prisma.notification.create({
      data: {
        title: "Schedule Notification",
        message: `RLE schedule for Week/s ${week}.`,
        recipientId: clinicalInstructor,
        type: "general",
        link: `/schedule/${schedules.id}`,
        expiresAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      },
    });

    await Promise.all(notificationPromises);

    const userSchedulingData = students.flatMap((studentId) =>
      dates.map((date) => ({
        userId: studentId,
        schedulingId: schedules.id,
        date: date,
        week: week,
      }))
    );

    await prisma.userScheduling.createMany({
      data: userSchedulingData,
    });

    const sanitizedSchedules = {
      id: schedules.id,
      clinicalHours: schedules.clinicalHours,
      dateFrom: schedules.dateFrom,
      dateTo: schedules.dateTo,
      groupId: schedules.groupId,
      yearLevel: schedules.yearLevel,
      area: schedules.area,
      users: schedules.user,
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

import { getCurrentSchoolYear } from "@/actions/get-current-school-year";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

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
      dates,
    } = body;

    if (
      !clinicalInstructor ||
      !clinicalHours ||
      !area ||
      !group ||
      !yearLevel ||
      !students ||
      !week ||
      !dates.length
    ) {
      return NextResponse.json({ error: "Missing Fields" }, { status: 400 });
    }

    const combinedUsers = [...students, clinicalInstructor.id, userId];
    const userIdsObject = combinedUsers.reduce((obj, userId) => {
      obj[userId] = userId;
      return obj;
    }, {});
    const userIdsArray = Object.keys(userIdsObject);

    const dateFromArray = dateFrom.map((date) => new Date(date));
    const dateToArray = dateTo.map((date) => new Date(date));
    const schoolyear = await getCurrentSchoolYear();

    const schedules = await db.scheduling.update({
      where: { id: scheduleId },
      data: {
        clinicalHours,
        dateFrom: dateFromArray,
        dateTo: dateToArray,
        groupId: group,
        yearLevel: yearLevel,
        areaId: area,
        week: week,
        userIds: userIdsArray,
        schoolyearId: schoolyear.id,
      },
      include: {
        user: true,
      },
    });

    const resources = await db.resourceGroup.update({
      where: {
        scheduleId: scheduleId,
      },
      data: {
        name: schedules.week,
        userIds: userIdsArray,
      },
    });

    const notificationPromises = students.map((userId) =>
      db.notification.create({
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

    const cinotificationpromise = db.notification.create({
      data: {
        title: "Schedule Notification",
        message: `RLE schedule for Week/s ${week}.`,
        recipientId: clinicalInstructor.id,
        type: "general",
        link: `/schedule/${schedules.id}`,
        expiresAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      },
    });

    const userSchedulingData = students.flatMap((studentId) =>
      dates.map((date) => ({
        userId: studentId,
        schedulingId: schedules.id,
        date: date,
        week: week,
      }))
    );

    await Promise.all([
      ...notificationPromises,
      resources,
      cinotificationpromise,
      db.userScheduling.deleteMany({
        where: {
          schedulingId: schedules.id,
          week: week,
        },
      }).then(() => db.userScheduling.createMany({ data: userSchedulingData })),
      // Add other promises here if needed
    ]);

    return NextResponse.json({ message: "Success" }, { status: 200 });
  } catch (error) {
    console.error("Error updating schedule:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export const dynamicParams = false;

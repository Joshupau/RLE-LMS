import { createAuditLog } from "@/lib/create-audit-log";
import { db } from "@/lib/db";
import { AuditAction } from "@prisma/client";
import { NextResponse } from "next/server";


async function disconnectUsersFromScheduleAndResourceGroup(scheduleId, userIds) {
  for (const userId of userIds) {
    await Promise.all([
      db.scheduling.update({
        where: { id: scheduleId },
        data: {
          user: { disconnect: { id: userId } }
        }
      }),
      db.resourceGroup.update({
        where: {
          scheduleId: scheduleId,
        },
        data: { users: { disconnect: { id: userId }}},
      })
    ]);
  }
}


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
      previousUsers,
      schoolyear
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

    await disconnectUsersFromScheduleAndResourceGroup(scheduleId, previousUsers);

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
      },
    });
    
    for (const userId of userIdsArray) {
      await Promise.all([
        db.scheduling.update({
          where: { id: scheduleId },
          data: {
            user: { connect: { id: userId } },
          },
        }),
        db.resourceGroup.update({
          where: { id: resources.id },
          data: {
            users: { connect: { id: userId } },
          },
        }),
      ]);
    }
    
      const createNotifications = async () => {
        const studentNotifications = students.map((userId) =>
          db.notification.create({
            data: {
              title: "Schedule Notification",
              message: `RLE schedule for Week/s ${week}.`,
              recipientId: userId,
              type: "general",
              link: `/schedule`,
            },
          })
        );

        const clinicalInstructorNotification = db.notification.create({
          data: {
            title: "Schedule Notification",
            message: `RLE schedule for Week/s ${week}.`,
            recipientId: clinicalInstructor.id,
            type: "general",
            link: `/schedule/${schedules.id}`,
          },
        });

        return Promise.all([...studentNotifications, clinicalInstructorNotification]);
      };

      const userSchedulingData = students.flatMap((studentId) =>
        dates.map((date) => ({
          userId: studentId,
          schedulingId: schedules.id,
          date: date,
          week: week,
        }))
      );

      await Promise.all([
        createNotifications(),
        resources,
        db.userScheduling.deleteMany({
          where: {
            schedulingId: schedules.id,
            week: week,
          },
        }).then(() => db.userScheduling.createMany({ data: userSchedulingData })),
      ]);

    await createAuditLog({
      entityId: schedules.id,
      Action: AuditAction.UPDATE,
      Title: "Schedule Update.",
    })

    return NextResponse.json({ message: "Success" }, { status: 200 });
  } catch (error) {
    console.error("Error updating schedule:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export const dynamicParams = false;

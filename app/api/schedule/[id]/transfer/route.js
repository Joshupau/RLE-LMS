import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const body = await request.json();
    const { userId, selectId, oldId } = body;

    if (selectId === oldId) {
      return NextResponse.json({ error: "Can't be transferred to the same schedule" }, { status: 400 });
    }

    let remove,removeUserScheduling, add, removeFromResource, addToResource, notify;

    try {
      remove = await db.scheduling.update({
        where: { id: oldId },
        data: { user: { disconnect: { id: userId } } }
      });
    } catch (removeError) {
      console.error("Error removing user from schedule:", removeError);
      throw new Error("Failed to remove user from schedule");
    }

    try {
      add = await db.scheduling.update({
        where: { id: selectId },
        data: { user: { connect: { id: userId } } }
      });
    } catch (addError) {
      console.error("Error adding user to schedule:", addError);
      throw new Error("Failed to add user to schedule");
    }

    try {
      removeFromResource = await db.resourceGroup.update({
        where: { scheduleId: oldId },
        data: { users: { disconnect: { id: userId } } }
      });
    } catch (error) {
      console.error("Error removing user from resource group:", error);
      throw new Error("Failed to remove user from resource group");
    }

    try {
      addToResource = await db.resourceGroup.update({
        where: { scheduleId: selectId },
        data: { users: { connect: { id: userId } } }
      });
    } catch (error) {
      console.error("Error adding user to resource group:", error);
      throw new Error("Failed to add user to resource group");
    }

    try {
      const { dateFrom, dateTo } = add;
      const datesInRange = [];
      let currentDate = new Date(dateFrom);
      while (currentDate <= dateTo) {
        datesInRange.push(new Date(currentDate));
        currentDate.setDate(currentDate.getDate() + 1);
      }

      const userSchedulingPromises = datesInRange.map(async (date) => {
        try {
          const userScheduling = await db.userScheduling.create({
            data: {
              userId,
              schedulingId: selectId,
              date,
              week: getWeekFromDate(date),
            },
          });
          return userScheduling;
        } catch (error) {
          console.error("Error creating user scheduling:", error);
        }
      });

      await Promise.all(userSchedulingPromises);
    } catch (error) {
      console.error("Error creating user schedulings:", error);
    }

    try {
      removeUserScheduling = await db.userScheduling.deleteMany({
        where: { userId, schedulingId: oldId }
      });
    } catch (error) {
      console.error("Error removing user schedulings:", error);
      throw new Error("Failed to remove user schedulings");
    }

    const { clinicalArea } = await db.scheduling.findUnique({
      where: { id: add.id },
      select: { clinicalArea: true }
    })

    notify = await db.notification.create({
      data: {
        title: "Schedule Transfer Notification",
        message: `You have been transferred to ${clinicalArea.name}.`,
        recipientId: userId,
        type: "general",
        link: `/schedule`,
      },
    });

    return NextResponse.json({ remove, add, notify, removeUserScheduling });
  } catch (error) {
    console.error("Error transferring user:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      userId,
      selectId,
      oldId,
    } = body;

    if (selectId === oldId) {
      return NextResponse.json({ error: "Can't be transferred to the same schedule" }, { status: 400 });
    }

    let remove, add;

    // Try removing the user from the old schedule
    try {
      remove = await prisma.scheduling.update({
        where: {
          id: oldId,
        },
        data: {
          user: {
            disconnect: {
              id: userId,
            }
          }
        }
      });
    } catch (removeError) {
      console.error("Error removing user from schedule:", removeError);
      throw new Error("Failed to remove user from schedule");
    }

    try {
      add = await prisma.scheduling.update({
        where: {
          id: selectId,
        },
        data: {
          user: {
            connect: {
              id: userId,
            }
          }
        }
      });
    } catch (addError) {
      console.error("Error adding user to schedule:", addError);
      throw new Error("Failed to add user to schedule");
    }

    const notify = await prisma.notification.create({
        data: {
            title: "Schedule Transfer Notification",
            message: `You have been transfered to ${add.area}.`,
            recipientId: userId,
            type: "general",
            link: `/schedule`,
          },
    })

    return NextResponse.json({ remove, add, notify });
  } catch (error) {
    console.error("Error transferring user:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

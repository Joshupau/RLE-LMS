import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { getServerSession } from "next-auth"
import { db } from "./db";



export const createAuditLog = async (props) => {
    try {
        const user = await getServerSession(authOptions);

        if(!user){
            throw new Error("User not found!");
        }

        const { Action, Title, userId, entityId } = props;

        await db.auditLog.create({
            data: {
                Action,
                Title,
                entityId,
                userId: user?.token.id,
                userName: user?.token.firstName + " " + user?.token.lastName
            }
        })

    } catch (error) {
        console.log("[AUDIT_LOG_ERROR]", error);
    }
}
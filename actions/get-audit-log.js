import { db } from "@/lib/db";


export const getAuditLogs = async () => {
    try {
        const logs = await db.auditLog.findMany({});

        return logs;
    } catch (error) {
        console.log("[GET_AUDIT_LOGS]", error);
    }
}
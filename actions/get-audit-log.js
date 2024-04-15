import { db } from "@/lib/db";


export const getAuditLogs = async () => {
    try {
        const logs = await db.auditLog.findMany({
            orderBy: {
                createdAt: "desc",
            },
            take: 10,
        });

        return logs;
    } catch (error) {
        console.log("[GET_AUDIT_LOGS]", error);
    }
}
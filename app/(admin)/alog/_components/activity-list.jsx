import { getAuditLogs } from "@/actions/get-audit-log";
import { ActivityItem } from "./activity-item";
import { Card, CardContent } from "@/components/ui/card";


export const ActivityList = async () => {
    const logs = await getAuditLogs();

    return (
        <>  
            <Card className="w-full">
                <CardContent>
            <ol className="space-y-4 mt-4">
                <p className="hidden last:block text-xs text-center">
                    No Activity logs found.
                </p>
                {logs.map((log)=> (
                    <ActivityItem key={log.id} data={log}/>
                ))
            }
            </ol>
            </CardContent>
            </Card>
        </>
    )
}
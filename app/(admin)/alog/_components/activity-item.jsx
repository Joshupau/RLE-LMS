import { Avatar } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { generateLogMessage } from "@/lib/generate-log-message"
import { format } from "date-fns"
import { User } from "lucide-react";

export const ActivityItem = ({data}) => {
    return (
        <>
            <li className="flex items-center gap-x-2">
                <div className="flex flex-col space-y-0.5">
                    <div className="flex items-center">
                        <Avatar className="w-8 h-8">
                            <User/>
                        </Avatar>
                        <p className="text-sm text-muted-foreground">
                            <span className="font-semibold lowercase text-neutral-700">
                                {data.userName}
                            </span> {generateLogMessage(data)}
                        </p>
                    </div>
                    <p className="text-xs text-muted-foreground">
                        {format(new Date(data.createdAt), "MMM d, yyyy 'at' h:mm a")}
                    </p>
                </div>
            </li>
            <Separator/>
        </>
    )
}

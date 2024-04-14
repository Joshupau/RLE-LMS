import { ActivityList } from "./_components/activity-list"



export const ActivityLogPage = async () => {


    return (
        <>
            <div className="p-6">    
                <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-y-2">
                    <h1 className="text-2xl font-medium">Activity Logs</h1>
                    </div>
                </div>
                <div className="flex items-center justify-start">
                    <ActivityList/>
                </div>
        </div>
        </>
    )
}

export default ActivityLogPage
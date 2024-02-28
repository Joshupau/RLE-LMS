

import Link from "next/link"
import ScheduleList from "./_components/schedule-list"
import { StudentScheduleList} from "./_components/student-schedule-list";
import { CIScheduleList } from "./_components/ci-schedule-list";
import { Button } from "@/components/ui/button";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export default async function SchedulePage() {

  const data = await getServerSession(authOptions);

  const userRole = data?.token.role;
  const userId = data?.token.id;

  return (
    <div className="p-6">
        s
        {userRole === 'Dean' && (
          <>
            <div className="flex items-center justify-between">
            <div className="flex flex-col gap-y-2">
              <h1 className="text-2xl font-medium">Schedule List</h1>
            </div>
          </div>
          <div>
            <ScheduleList/>
            <div className="mt-4">
              <Link href={'/schedule/create'}>
                <Button>
                Create Schedule
                </Button>
              </Link>
            </div>
            
          </div>
          </>
      )}

      {userRole === 'ClinicalInstructor' &&(
        <>
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-y-2">
              <h1 className="text-2xl font-medium">Schedule List</h1>
            </div>
          </div>
          <CIScheduleList userId={userId}/>
        </>
      )}

      {userRole === 'Student' && (
        <>
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-y-2">
              <h1 className="text-2xl font-medium">Schedule List</h1>
            </div>
          </div>
          <StudentScheduleList userId={userId}/>
        </>
      )}

    </div>

  )
}


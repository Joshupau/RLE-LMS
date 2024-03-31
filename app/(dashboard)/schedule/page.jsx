

import Link from "next/link"
import { StudentScheduleList} from "./_components/student-schedule-list";
import { Button } from "@/components/ui/button";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";


import DeanDataTable from "./DeanDataTable";
import CIDataTable from "./CIDataTable";
import StudentDataTable from "./StudentDataTable";

import { getScheduleWithUsers } from "@/actions/get-schedule";
import { CISchedule } from "@/actions/get-ci-schedule";
import { studentSchedule } from "@/actions/get-student-schedule";

export default async function SchedulePage() {

  const data = await getServerSession(authOptions);

  const userRole = data?.token.role;
  const userId = data?.token.id;

  const DeanSchedules = await getScheduleWithUsers();
  const CISchedules = await CISchedule(data.token.id);
  const StudentSchedules = await studentSchedule(data.token.id);

  return (
    <div className="p-6">
        
        {userRole === 'Dean' && (
          <>
            <div className="flex items-center justify-between">
            <div className="flex flex-col gap-y-2">
              <h1 className="text-2xl font-medium">Schedule List</h1>
            </div>
          </div>
          <div>
            <DeanDataTable data={DeanSchedules}/>
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
          <CIDataTable data={CISchedules.schedules}/>
        </>
      )}

      {userRole === 'Student' && (
        <>
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-y-2">
              <h1 className="text-2xl font-medium">Schedule List</h1>
            </div>
          </div>
          <StudentDataTable data={StudentSchedules.schedules}/>
        </>
      )}

    </div>

  )
}


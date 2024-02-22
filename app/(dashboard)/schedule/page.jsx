'use client'


import { useSession } from "next-auth/react"
import Link from "next/link"
import ScheduleList from "./_components/schedule-list"
import { StudentScheduleList } from "./_components/student-schedule-list";
import { CIScheduleList } from "./_components/ci-schedule-list";

function SchedulePage() {

  const {data: session } = useSession(); 
  
  const userRole = session?.token.role;
  const userId = session?.token.id;

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
            <ScheduleList/>
            <div>
              <Link href={'/schedule/create'}>
              <button 
              className="p-4 bg-blue-500 text-white rounded-full">
                Create Schedule
              </button>
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

export default SchedulePage
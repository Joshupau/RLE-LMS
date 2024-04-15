import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import DeanDataTable from "./DeanDataTable";
import CIDataTable from "./CIDataTable";
import StudentDataTable from "./StudentDataTable";
import { getScheduleWithUsers } from "@/actions/get-schedule";
import { CISchedule } from "@/actions/get-ci-schedule";
import { studentSchedule } from "@/actions/get-student-schedule";
import { Suspense } from "react";
import { SkeletonCard } from "@/components/skeleton-loader";

export default async function SchedulePage() {
  const data = await getServerSession(authOptions);
  const userRole = data?.token.role;

  let DeanSchedules = await getScheduleWithUsers();
  let CISchedules = await CISchedule(data.token.id);
  let StudentSchedules = await studentSchedule(data.token.id);
  
  if (!DeanSchedules) DeanSchedules = [];
  if (!CISchedules) CISchedules = { schedules: [] };
  if (!StudentSchedules) StudentSchedules = { schedules: [] };

  return (
    <div className="p-6 mt-16">
      {userRole === "Dean" && (
        <>
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-y-2">
              <h1 className="text-2xl font-medium">Schedule List</h1>
            </div>
          </div>
          {DeanSchedules.length > 0 ? (
            <div>
              <DeanDataTable data={DeanSchedules} />
            </div>
          ) : (
            <p>No schedules</p>
          )}
              <div className="mt-4">
                <Link href={"/schedule/create"}>
                  <Button>Create Schedule</Button>
                </Link>
              </div>
        </>
      )}
      {userRole === "ClinicalInstructor" && (
        <>
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-y-2">
              <h1 className="text-2xl font-medium">Schedule List</h1>
            </div>
          </div>
          {CISchedules.schedules.length > 0 ? (
            <CIDataTable data={CISchedules.schedules} />
          ) : (
            <p>No schedules</p>
          )}
        </>
      )}
      {userRole === "Student" && (
        <>
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-y-2">
              <h1 className="text-2xl font-medium">Schedule List</h1>
            </div>
          </div>
          {StudentSchedules.length > 0 ? (
            <StudentDataTable data={StudentSchedules} />
          ) : (
            <p>No schedules</p>
          )}
        </>
      )}
    </div>
  );
}

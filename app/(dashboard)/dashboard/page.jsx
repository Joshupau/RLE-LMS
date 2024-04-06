
import CarouselPlugin from "./_components/carousel";

import { Card, CardContent } from "@/components/ui/card";

import  SchedulingCalendar  from "./_components/calendar";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { CISchedule } from "@/actions/get-ci-schedule";
import DataTable from "./DataTable";
import { approvedCases } from "@/actions/get-approved-cases";
import { pendingCase } from "@/actions/get-pending-cases";
import { Suspense } from "react";
import { SkeletonCard } from "@/components/skeleton-loader";


export const Dashboard = async () => {
  const data = await getServerSession(authOptions);

  const [scheduledata, ApprovedCases, PendingCases] = await Promise.all([
    CISchedule(data.token.id),
    approvedCases(data.token.id),
    pendingCase(data.token.id)
  ]);


  return (
    <>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-16">
              <div className="col-span-2 row-span-2">
              <CarouselPlugin/>
              </div>
              {data.token.role === 'Student' && ApprovedCases.length !== 0 && (
                <div>
                  <h1 className="text-xl font-medium">Approved Cases</h1>
                  <Card>
                    <DataTable data={ApprovedCases} />
                  </Card>
                </div>
              )}

              {data.token.role === 'ClinicalInstructor' && PendingCases.length !== 0 && (
                <div>
                  <h1 className="text-xl font-medium">Pending Cases</h1>
                  <Card>
                    <DataTable data={PendingCases} />
                  </Card>
                </div>
              )}

              <div className="col-span-2 row-span-2">
                <Suspense fallback={<SkeletonCard/>}>
                  <SchedulingCalendar scheduledata={scheduledata.schedules}/>
                </Suspense>
                
              </div>
        </div>
    </>
  );
}

export default Dashboard;

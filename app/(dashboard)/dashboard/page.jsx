
import CarouselPlugin from "./_components/carousel";

import { Card } from "@/components/ui/card";

import  SchedulingCalendar  from "./_components/calendar";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { CISchedule } from "@/actions/get-ci-schedule";
import DataTable from "./DataTable";
import { approvedCases } from "@/actions/get-approved-cases";
import { pendingCase } from "@/actions/get-pending-cases";


async function fetchData(data) {
  const schedules = await CISchedule(data.token.id);
  const ApprovedCases = await approvedCases(data.token.id);
  const PendingCases = await pendingCase(data.token.id);
  return { schedules, ApprovedCases, PendingCases };
}

export const Dashboard = async () => {
  const data = await getServerSession(authOptions);

  const { schedules, ApprovedCases, PendingCases } = await fetchData(data);


  if(!data){
    return <p> Loading ...</p>
  }
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-16">
        <div className="col-span-2 row-span-2">
          <CarouselPlugin />
        </div>
        {data.token.role === 'Student' && ApprovedCases && (
          <div>
            <h1 className="text-xl font-medium">Approved Cases</h1>
            <Card>
              <DataTable data={ApprovedCases} />
            </Card>
          </div>
        )}
        {data.token.role === 'ClinicalInstructor' && PendingCases && (
          <div>
            <h1 className="text-xl font-medium">Pending Cases</h1>
            <Card>
              <DataTable data={PendingCases} />
            </Card>
          </div>
        )}
        <div className="col-span-2 row-span-2">
          <SchedulingCalendar scheduledata={schedules.schedules} />
        </div>
      </div>
    </>
  );
};

export default Dashboard;

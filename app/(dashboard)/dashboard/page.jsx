
import CarouselPlugin from "./_components/carousel";

import { Card } from "@/components/ui/card";

import  SchedulingCalendar  from "./_components/calendar";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { CISchedule } from "@/actions/get-ci-schedule";
import DataTable from "./DataTable";
import { approvedCases } from "@/actions/get-approved-cases";
import { pendingCase } from "@/actions/get-pending-cases";


async function getUserData(){
  const session = await getServerSession(authOptions);

  if (!session) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }

  return session.token
}
export const Dashboard = async () => {
  const data = await getUserData();

  console.log(data);

  const  schedules = await CISchedule(data.id);
  const ApprovedCases = await approvedCases(data.id);
  const PendingCases = await pendingCase(data.id);

  return (
    <>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-16">
              <div className="col-span-2 row-span-2">
              <CarouselPlugin/>
              </div>
                {/* { data.role === 'Student' && (
                <div>
                  <h1 className="text-xl font-medium">Approved Cases</h1>
                  <Card>
                    <DataTable data={ApprovedCases}/>
                  </Card>
              </div>
                )}
                { data.role === 'ClinicalInstructor' && (
                <div>
                  <h1 className="text-xl font-medium">Pending  Cases</h1>
                  <Card>
                    <DataTable data={PendingCases}/>
                  </Card>
              </div>
                )}
              <div className="col-span-2 row-span-2">
                  <SchedulingCalendar scheduledata={schedules.schedules}/>                
              </div> */}
        </div>
    </>
  );
}

export default Dashboard;



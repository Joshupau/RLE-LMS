import CarouselPlugin from "./_components/carousel";
import { Card } from "@/components/ui/card";
import SchedulingCalendar from "./_components/calendar";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { CISchedule } from "@/actions/get-ci-schedule";
import DataTable from "./DataTable";
import { approvedCases } from "@/actions/get-approved-cases";
import { pendingCase } from "@/actions/get-pending-cases";

export const Dashboard = async () => {
  const data = await getServerSession(authOptions);

  if (!data) {
    return <p>Loading....</p>;
  }

  const schedules = await CISchedule(data.token.id);
  const ApprovedCases = await approvedCases(data.token.id);
  const PendingCases = await pendingCase(data.token.id);

  return (
    <>
      <div className="grid grid-cols-1 mt-20 md:grid-cols-3 gap-6 my-16">
        <div className="col-span-2 row-span-2">
          <CarouselPlugin />
        </div>
        {data.token.role === "Student" && ApprovedCases.length > 0 && (
          <div className="mt-10">
            <h1 className="text-xl font-medium">Approved Cases</h1>
            <Card>
              <DataTable data={ApprovedCases} />
            </Card>
          </div>
        )}
        {data.token.role === "ClinicalInstructor" && PendingCases.length > 0 && (
          <div className="mt-10">
            <h1 className="text-xl font-medium">Pending Cases</h1>
            <Card>
              <DataTable data={PendingCases} />
            </Card>
          </div>
        )}
        {schedules.schedules.length > 0 && (
          <div className="col-span-2 row-span-2">
            <SchedulingCalendar scheduledata={schedules.schedules} />
          </div>
        )}
      </div>
    </>
  );
};

export default Dashboard;

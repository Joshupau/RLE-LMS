
import CarouselPlugin from "./_components/carousel";

import { Card, CardContent } from "@/components/ui/card";

import  SchedulingCalendar  from "./_components/calendar";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { CISchedule } from "@/actions/get-ci-schedule";


export const Dashboard = async () => {
  const data = await getServerSession(authOptions);

  const scheduledata = await CISchedule(data.token.id)

  return (
    <>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-16">
              <div className="col-span-2 row-span-2">
              <CarouselPlugin/>
              </div>
              <div>
                  <Card>
                    <CardContent>
                      Here is the Calendar
                    </CardContent>
                  </Card>
              </div>
              <div>
                  <Card>
                    <CardContent>
                      Here is the List of Approved Cases
                    </CardContent>
                  </Card>
              </div>
              <div className="col-span-2 row-span-2">
              <SchedulingCalendar scheduledata={scheduledata.schedules}/>
              </div>
        </div>
    </>
  );
}

export default Dashboard;

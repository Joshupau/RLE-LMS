import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { getServerSession } from "next-auth"

import { Suspense } from "react";
import { SkeletonCard } from "@/components/skeleton-loader";

import { CaseTrends } from "./_components/case-trends";
import { BarChart } from "./_components/case-analytics-barchart";
import GuidelinesTable from "./_components/guideline-table";
import { AttendanceAnalytics } from "./_components/attendance-analytics";
import { ProgressReport } from "./_components/progress-report";

import { getAttendanceAbsencesTotalByMonth } from "@/actions/get-dean-dashboard";
import { getCasePerformance } from "@/actions/get-cases-performance";
import { getProgressReport } from "@/actions/get-progress-report";
import { getCurrentSchoolYear } from "@/actions/get-current-school-year";


export default async function ProgressPage(){
    const data = await getServerSession(authOptions);
    const analyticsData = await getAttendanceAbsencesTotalByMonth();
    const { barChartData, yearLevelTables } = await getCasePerformance();
    const ProgressReportData = await getProgressReport();

    const currentschoolyear = await getCurrentSchoolYear();


    return(
        <>
            <div className="p-6">    
                <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-y-2">
                    <h1 className="text-2xl font-medium">RLE Performance</h1>
                    </div>
                </div>  
            {data.token.role === 'Dean' &&(
                <>
              <div className="my-16">
              <h1 className="text-xl font-medium mb-2">Attendance Line Chart</h1>
              <Suspense fallback={<SkeletonCard/>}>
                <AttendanceAnalytics data={analyticsData}/>
                </Suspense>                           
              </div>

              <div className="my-16">
                    <h1 className="text-xl font-medium mb-2">RLE Progress Report</h1>
                    <ProgressReport data={ProgressReportData}/>
              </div>
                </>
             )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-16">
                    <div className="overflow-x-auto gap-y-2">
                        {data.token.role === 'Dean' &&(
                        <div>
                        <h1 className="text-xl font-medium">Cases Submitted per level</h1>
                        <Suspense fallback={<SkeletonCard/>}>
                            <BarChart data={barChartData}/>
                        </Suspense>                           
                        </div>
                            )}
                    </div>
                    <div className="overflow-x-auto gap-y-2">
                    {data.token.role === 'Dean' &&(
                        <>
                            <div>
                            <h1 className="text-xl font-medium mb-2">Cases Comparison</h1>                           
                                <CaseTrends yearLevelTables={yearLevelTables}/>
                            </div>
                            </>
                        )}
                    </div>      
             </div>
             </div>
             </>
             )
            }
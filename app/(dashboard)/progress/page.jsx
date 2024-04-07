import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { getServerSession } from "next-auth"
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
  import {
    Popover,
  } from "@/components/ui/popover"

  import { studentSchedule } from "@/actions/get-student-schedule";
  import { studentCases } from "@/actions/get-student-cases";
  import { CasesAssigned } from "@/actions/get-cases";

  import CIDataTable from "./CIDataTable";
  import DataTable from "./DataTable";
  import { getAbsences } from "@/actions/get-absences";
  import { getAttendance } from "@/actions/get-attendance";
  
  import { Suspense } from "react";

  import { CaseTrends } from "./_components/case-trends";
  import { BarChart } from "./_components/case-analytics-barchart";
  import GuidelinesTable from "./_components/guideline-table";
  import { StudentPerformanceCards } from "./_components/student-performance-cards";
  import { AttendanceProgress } from "./_components/attendance-progress";
  import { StudentCaseProgress } from "./_components/student-case-progress";
  import { PatientCaseSubmission } from "./_components/patient-case-submission";
  import { AttendanceAnalytics } from "./_components/attendance-analytics";
  import { getAttendanceAbsencesTotalByMonth } from "@/actions/get-dean-dashboard";
import { getCasePerformance } from "@/actions/get-cases-performance";
import { getProgressReport } from "@/actions/get-progress-report";

import { ProgressReport } from "./_components/progress-report";
import { SkeletonCard } from "@/components/skeleton-loader";
import { getCurrentSchoolYear } from "@/actions/get-current-school-year";

export default async function ProgressPage(){
    const data = await getServerSession(authOptions);

// Assuming data.token.role contains the user's role
const userRole = data.token.role;

// Define boolean variables to indicate whether to fetch data based on the user's role
const fetchAttendance = ['ClinicalInstructor', 'Dean'].includes(userRole);
const fetchSchedules = ['Student'].includes(userRole);
const fetchCases = ['Student'].includes(userRole);
const fetchAbsences = ['Student'].includes(userRole);
const fetchCasesAssigned = ['ClinicalInstructor', 'Dean'].includes(userRole);

const attendancePromise = fetchAttendance ? getAttendance(data.token.id) : Promise.resolve([]);
const schedulesPromise = fetchSchedules ? studentSchedule(data.token.id) : Promise.resolve([]);
const casesPromise = fetchCases ? studentCases(data.token.id) : Promise.resolve([]);
const casesAssignedPromise = fetchCasesAssigned ? CasesAssigned(data.token.id) : Promise.resolve([]);
const absencesPromise = fetchAbsences ? getAbsences(data.token.id): Promise.resolve([]);

const analyticsData = await getAttendanceAbsencesTotalByMonth();
const { barChartData, yearLevelTables } = await getCasePerformance();
const ProgressReportData = await getProgressReport();
const [attendance, schedules, cases, casesAssigned, absences] = await Promise.all([attendancePromise, schedulesPromise, casesPromise, casesAssignedPromise, absencesPromise]);

const currentschoolyear = await getCurrentSchoolYear();

console.log(currentschoolyear);

const groupColors = {
    A: 'bg-green-500',
    B: 'bg-blue-500',
  };
    return(
        <>
            <div className="p-6">    
                <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-y-2">
                    <h1 className="text-2xl font-medium">RLE Performance</h1>
                    </div>
                </div>
            {data.token.role === 'Student' &&(
            <div className="mt-5 flex flex-col gap-4 md:flex-row md:items-start md:gap-8">
                <Suspense fallback={<SkeletonCard/>}>
                    <StudentPerformanceCards absences={absences} cases={cases} />
                </Suspense>
            </div>
                )}
            
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
                        {['ClinicalInstructor'].includes(data.token.role) && (
                            <>
                            <div>
                                {!casesAssigned && <span>Fetching Data</span>}
                                <h1 className="text-xl font-medium">Student Cases</h1>
                                {casesAssigned.length > 0 ? (
                                    <Suspense fallback={<SkeletonCard/>}>
                                    <CIDataTable data={casesAssigned}/>
                                    </Suspense>
                                ) : (
                                <span>No cases submitted</span>
                                )}                            
                            </div>
                            </>
                        )}
                        {data.token.role === 'Dean' &&(
                        <div>
                        <h1 className="text-xl font-medium">Cases Submitted per level</h1>
                        <Suspense fallback={<SkeletonCard/>}>
                            <BarChart data={barChartData}/>
                        </Suspense>                           
                        </div>
                            )}
                            {data.token.role === 'Student' &&(
                                <>
                        <div>
                            {!cases && <span>Fetching Data</span>}
                            {cases && cases.length > 0 && 
                            <Suspense fallback={<SkeletonCard/>}>
                            <DataTable data={cases}/>
                            </Suspense>
                            }
                        </div>
                        <div className="my-4">
                        <Dialog>
                            <Popover>
                                <DialogTrigger asChild>
                                <Button>
                                    Submit Patient Case
                                </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[425px] md:min-w-max">
                                    <DialogHeader>
                                    <DialogTitle>Patient Case Information</DialogTitle>
                                    <DialogDescription>
                                        Type the information of your Case.
                                    </DialogDescription>
                                    </DialogHeader>
                                    <PatientCaseSubmission userId={schedules.id} yearLevel={schedules.yearLevel} schedules={schedules.schedules} />
                                </DialogContent>
                            </Popover>
                        </Dialog>
                        </div>
                        </>
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
                        {['ClinicalInstructor'].includes(data.token.role) && (
                            <div>
                                <h1 className="text-xl font-medium">Attendance Monitoring</h1>
                                {attendance.length > 0 ? (
                                    <AttendanceProgress attendance={attendance} />
                                ) : (
                                    <span>Not yet Scheduled!</span>
                                    )}
                            </div>
                        )}
                    </div>
                    
             </div>
          {data.token.role === 'Student' &&(
             <div>
            {cases && cases.length > 0 && <StudentCaseProgress data={cases} />}
             </div>
             )}
             </div>
             </>
             )
            }
import { getAbsences } from "@/actions/get-absences";
import { studentCases } from "@/actions/get-student-cases";
import { studentSchedule } from "@/actions/get-student-schedule";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { SkeletonCard } from "@/components/skeleton-loader";
import { getServerSession } from "next-auth";
import { Suspense } from "react";
import DataTable from "./DataTable";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
  import {
    Popover,
  } from "@/components/ui/popover"
import { StudentCaseProgress } from "./_components/student-case-progress";
import { StudentPerformanceCards } from "./_components/student-performance-cards";
import { PatientCaseSubmission } from "./_components/patient-case-submission";

export const StudentPage = async () => {
    const data = await getServerSession(authOptions);

    const userRole = data.token.role;
    
    const fetchSchedules = ['Student'].includes(userRole);
    const fetchCases = ['Student'].includes(userRole);
    const fetchAbsences = ['Student'].includes(userRole);
    
    const schedulesPromise = fetchSchedules ? studentSchedule(data.token.id) : Promise.resolve([]);
    const casesPromise = fetchCases ? studentCases(data.token.id) : Promise.resolve([]);
    const absencesPromise = fetchAbsences ? getAbsences(data.token.id): Promise.resolve([]);
    
    const [schedules, cases, absences] = await Promise.all([ schedulesPromise, casesPromise, absencesPromise]);
    
    return(
        <>
             <div className="p-6 mt-28">    
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
                        {data.token.role === 'Student' &&(
                                <>
                        <div className="mt-16">
                            {!cases && <span>Fetching Data</span>}
                            {cases && cases.length > 0 && 
                            <Suspense fallback={<SkeletonCard/>}>
                            <DataTable data={cases}/>
                            </Suspense>
                            }
                        </div>
                        <div className="my-4 flex flex-end justify-end items-end">
                        <Dialog>
                            <Popover>
                                <DialogTrigger asChild>
                                <Button className="h-[3rem] text-md bg-blue-500 hover:bg-blue-600">
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
                                    <PatientCaseSubmission userId={data?.token.id} schedules={schedules} />
                                </DialogContent>
                            </Popover>
                        </Dialog>
                        </div>
                        </>
                        )}
          {data.token.role === 'Student' &&(
             <div className="mt-16">
            {cases && cases.length > 0 && 
            <>
            <h1 className="text-xl font-medium mb-2">Overall Case Performance</h1>
            <StudentCaseProgress data={cases} />
            </>
            }
             </div>
             )}
             </div>
             </>
    )
}

export default StudentPage
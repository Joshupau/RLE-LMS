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
import { PatientCaseSubmission } from "./_components/patient-case-submission";
import { studentSchedule } from "@/actions/get-student-schedule";
import { studentCases } from "@/actions/get-student-cases";
import DataTable from "./DataTable";
import CIDataTable from "./CIDataTable";
import { CasesAssigned } from "@/actions/get-cases";


export default async function ProgressPage(){
    const data = await getServerSession(authOptions);

    const schedules = await studentSchedule(data.token.id);
    const cases = await studentCases(data.token.id);
    const casesAssigned = await CasesAssigned(data.token.id);
    return(
        <>
            <div className="p-6">    
                <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-y-2">
                    <h1 className="text-2xl font-medium">RLE Performance</h1>
                    <span className="text-sm text-slate-700">Submit and view your RLE cases</span>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
                    <div className="overflow-x-auto gap-y-2">
                        {data.token.role === 'ClinicalInstructor' && (
                            <>
                            <div>
                                {!cases && <span>Fetching Data</span>}
                                <h1 className="text-xl font-medium">Student Cases</h1>
                                {cases && <CIDataTable data={casesAssigned}/>}
                            </div>
                            </>
                        )}
                            {data.token.role === 'Student' &&(
                                <>
                        <div>
                            {!cases && <span>Fetching Data</span>}
                            <h1 className="text-xl font-medium">Your Submitted Cases</h1>
                            {cases && <DataTable data={cases}/>}
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
                        This side is the attendance and performance on each cases 
                        with a goal
                    </div>
             </div>
             </div>
             </>
             )
}
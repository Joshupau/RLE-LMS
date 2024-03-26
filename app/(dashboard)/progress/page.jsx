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
  import DataTable from "./DataTable";
  import CIDataTable from "./CIDataTable";
  import { CasesAssigned } from "@/actions/get-cases";

  import { AttendanceProgress } from "./_components/attendance-progress";
  import { StudentCaseProgress } from "./_components/student-case-progress";
  import { PatientCaseSubmission } from "./_components/patient-case-submission";
import { getAttendance } from "@/actions/get-attendance";


export default async function ProgressPage(){
    const data = await getServerSession(authOptions);

// Assuming data.token.role contains the user's role
const userRole = data.token.role;

// Define boolean variables to indicate whether to fetch data based on the user's role
const fetchAttendance = ['ClinicalInstructor', 'Dean'].includes(userRole);
const fetchSchedules = ['Student'].includes(userRole);
const fetchCases = ['Student'].includes(userRole);
const fetchCasesAssigned = ['ClinicalInstructor', 'Dean'].includes(userRole);

const attendancePromise = fetchAttendance ? getAttendance(data.token.id) : Promise.resolve([]);
const schedulesPromise = fetchSchedules ? studentSchedule(data.token.id) : Promise.resolve([]);
const casesPromise = fetchCases ? studentCases(data.token.id) : Promise.resolve([]);
const casesAssignedPromise = fetchCasesAssigned ? CasesAssigned(data.token.id) : Promise.resolve([]);

const [attendance, schedules, cases, casesAssigned] = await Promise.all([attendancePromise, schedulesPromise, casesPromise, casesAssignedPromise]);

    return(
        <>
            <div className="p-6">    
                <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-y-2">
                    <h1 className="text-2xl font-medium">RLE Performance</h1>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
                    <div className="overflow-x-auto gap-y-2">
                        {['ClinicalInstructor', 'Dean'].includes(data.token.role) && (
                            <>
                            <div>
                                {!casesAssigned && <span>Fetching Data</span>}
                                <h1 className="text-xl font-medium">Student Cases</h1>
                                {casesAssigned.length > 0 ? (
                                <CIDataTable data={casesAssigned}/>
                                ) : (
                                <span>No cases submitted</span>
                                )}                            
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
                        {data.token.role === 'Student' &&(
                        <div>
                            {cases && <StudentCaseProgress data={cases}/>}
                        </div>
                        )}
                        {['ClinicalInstructor', 'Dean'].includes(data.token.role) && (
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
             </div>
             </>
             )
}
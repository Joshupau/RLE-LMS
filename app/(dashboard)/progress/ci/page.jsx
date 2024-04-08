
import { getAttendance } from "@/actions/get-attendance";
import CIDataTable from "./CIDataTable"
import { CasesAssigned } from "@/actions/get-cases";
import { AttendanceProgress } from "./_components/attendance-progress";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { Suspense } from "react";
import { SkeletonCard } from "@/components/skeleton-loader";

export const CIPage = async () => {
    const data = await getServerSession(authOptions);

    const userRole = data.token.role;

    const fetchAttendance = ['ClinicalInstructor'].includes(userRole);
    const fetchCasesAssigned = ['ClinicalInstructor'].includes(userRole);

    const attendancePromise = fetchAttendance ? getAttendance(data.token.id) : Promise.resolve([]);
    const casesAssignedPromise = fetchCasesAssigned ? CasesAssigned(data.token.id) : Promise.resolve([]);

    const [attendance, casesAssigned] = await Promise.all([attendancePromise, casesAssignedPromise]);

    return (
        <>
            <div className="p-6">    
                <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-y-2">
                    <h1 className="text-2xl font-medium">RLE Performance</h1>
                    </div>
                </div>
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
                    </div>
                    <div className="overflow-x-auto gap-y-2">
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
             </div>
        </>
    )
}

export default CIPage
import { getScheduleWithUsers } from "@/actions/get-schedule";
import { getScheduleId } from "@/actions/get-schedule-id";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { EditSchedule } from "./_components/edit-schedule";
import { getStudent } from "@/actions/get-student";
import { getClinicalInstructors } from "@/actions/get-clinicalinstructor";
import { getClinicalAreas } from "@/actions/get-clinical-areas";

export default async function EditSchedulePage({ params }){
    const session = await getServerSession(authOptions);

    const { id } = params;

    const schedule = await getScheduleId(id);
    const students = await getStudent();
    const clinicalInstructor = await getClinicalInstructors();
    const areas = await getClinicalAreas();

    
    return (
  <>
    <EditSchedule areas={areas} clinicalInstructor={clinicalInstructor} userId={session?.token.id} {...schedule} student={students}/>
  </>
  
    )
  }
  export async function generateStaticParams() {
    const scheduleIds = await getScheduleWithUsers(); 
  
    return scheduleIds.map((schedule)=>({
      id: schedule.id
    }))
  }
  
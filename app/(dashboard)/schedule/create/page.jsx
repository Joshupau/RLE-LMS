
import { getStudent } from "@/actions/get-student";
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { getServerSession } from "next-auth"
import { CreateSchedule } from "./_components/create-schedule";
import { getClinicalInstructors } from "@/actions/get-clinicalinstructor";
import { getClinicalAreas } from "@/actions/get-clinical-areas";


export default async function CreateSchedulePage() {
  const session = await getServerSession(authOptions);
  const clinicalInstructor = await getClinicalInstructors();
  const students = await getStudent();
  const areas = await getClinicalAreas();

  return (
    <>
      <CreateSchedule areas={areas} userId={session.token.id} students={students} clinicalInstructor={clinicalInstructor}/>  
    </>

  )
}



import { getStudent } from "@/actions/get-student";
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { getServerSession } from "next-auth"
import { CreateSchedule } from "./_components/create-schedule";
import { getClinicalInstructors } from "@/actions/get-clinicalinstructor";


export default async function CreateSchedulePage() {
  const session = await getServerSession(authOptions);
  const clinicalInstructor = await getClinicalInstructors();
  const students = await getStudent();

  return (
    <>
      <CreateSchedule userId={session.token.id} students={students} clinicalInstructor={clinicalInstructor}/>  
    </>

  )
}


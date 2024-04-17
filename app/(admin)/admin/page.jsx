import { getAllUsers } from "@/actions/get-all-users"

import DataTable from "./DataTable";
import { AddSchoolYear } from "./_components/add-school-year";
import { Schoolyearcard } from "./_components/school-year-card";
import { getAllSchoolYear } from "@/actions/get-school-year";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { UserRole } from "@prisma/client";

export default async function AdminPage (){

    const user = await getServerSession(authOptions);

    console.log(user);
    if(user?.token.role !== UserRole.SystemAdmin){
        return <p>Unauthorized Access!</p>
    }

    const users = await getAllUsers();
    const schoolyear = await getAllSchoolYear();

    return (
        <>
        <div className="m-8">
            <DataTable data={users}/>

            <div className="place-items-center mt-4 mb-4 w-1/2">
                <Schoolyearcard schoolyear={schoolyear}/>
            </div>
                <AddSchoolYear/>
        </div>
        </>
    )
}
import { getAllUsers } from "@/actions/get-all-users"

import DataTable from "./DataTable";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AddSchoolYear } from "./_components/add-school-year";
import { Schoolyearcard } from "./_components/school-year-card";
import { getAllSchoolYear } from "@/actions/get-school-year";
import { AddUser } from "./_components/add-user";

export default async function AdminPage (){

    const users = await getAllUsers();
    const schoolyear = await getAllSchoolYear();

    return (
        <>
        <div className="m-8">
            <div className="flex justify-end mr-2">
                 <AddUser />
            </div>

            <Card>
            <DataTable data={users}/>
            </Card>

            <div className="place-items-center mt-4 mb-4 w-1/2">
                <Schoolyearcard schoolyear={schoolyear}/>
            </div>
                <AddSchoolYear/>
        </div>
        </>
    )
}
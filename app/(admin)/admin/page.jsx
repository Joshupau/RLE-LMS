import { getAllUsers } from "@/actions/get-all-users"

import DataTable from "./DataTable";
import { Card } from "@/components/ui/card";

export default async function AdminPage (){

    const users = await getAllUsers();

    return (
        <>
        <div className="m-8">
            <Card>
            <DataTable data={users}/>
            </Card>
        </div>
        </>
    )
}
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { getServerSession } from "next-auth"



export default async function ProgressPage(){
    const data = await getServerSession(authOptions);

    console.log(data.token.id);
    return(
        <>
        <div>
            This is your user ID {data.token.id}
        </div>
        </>
    )
}
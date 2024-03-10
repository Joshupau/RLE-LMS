import { Loginform } from "./_components/loginform"

import { getServerSession } from "next-auth"
import { authOptions } from "../api/auth/[...nextauth]/route"
import { redirect } from "next/navigation";

export default async function Home() {
const session = await getServerSession(authOptions);

 if(session){
  redirect('/dashboard');
 }

  return (
    <main>
        <div className="bg-slate-100">
          <Loginform />
        </div>
    </main>
  )
}

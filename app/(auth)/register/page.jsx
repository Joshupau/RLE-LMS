import React from 'react'
import Registerform from '../_components/registerform'

import { getServerSession } from "next-auth"
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { redirect } from "next/navigation"

export const RegisterPage = async () => {
  const session = await getServerSession(authOptions);

 if(session){
  redirect('/dashboard');
 }
  return (
    <>
    <div className="bg-slate-100">
    <Registerform />
    </div>
    </>
    )
}

export default RegisterPage
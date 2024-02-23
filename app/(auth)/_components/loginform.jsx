'use client';

import { redirect, useRouter } from "next/navigation";
import { useState } from "react";
import { signIn } from "next-auth/react";

import Link from "next/link"
import Image from "next/image"
import { User2, LockKeyhole } from "lucide-react";

export const Loginform = () => {

    const router = useRouter();
    const [error, setError] = useState(null);
    const [data, setData] = useState({
        schoolId: "",
        password: "",
    });

    const loginUser = async (e) => {
        e.preventDefault();
        try {
            // Attempt to sign in
            const response = await signIn('credentials', {
              ...data,
              redirect: false,
            });
      
            // If successful, redirect to the dashboard
            if (response?.error) {
              setError("input correct credentials");
            } else {
              router.push("/dashboard");
            }
          } catch (error) {
            console.error("Authentication error:", error);
            setError("Authentication failed");
          }

    };
    
    
  return (
          <div className="grid place-items-center h-screen justify-center heroImage">
            <div className="w-96 max-w-md mx-auto p-6 bg-white border rounded-md shadow-sm items-center">
                    <Image
                     src="/logo.png"
                     width={300}
                     height={300}
                     alt="Picture of Logo"
                     className="w-full"
                    />
                    
                <p>Welcome back</p>
                <h3 className="text-2xl font-bold">Login to your account</h3>
                <form onSubmit={loginUser}>
                        <label htmlFor="ID Number" className="mt-2 ml-4 block text-sm">ID Number</label>
                        <div className="relative">
                        <User2 
                        className="absolute left-3 top-1/2 transform -translate-y-1/2"/>
                        <input
                            value={data.schoolId}
                            onChange={(e) => {
                                setData({...data, schoolId: e.target.value})}
                            }                  
                            type="text"
                            id="schoolId"
                            name="ID number"
                            placeholder="ID Number"
                            className="border text-sm text-black w-full rounded-xl bg-cyan-200 pl-10 pr-3 py-2 focus:outline-none focus:ring focus:border-blue-500"
                        />
                    </div>
                    <label htmlFor="Password" className="mt-2 ml-4 block text-sm">Password</label>
                        <div className="relative">
                        <LockKeyhole className="absolute left-3 top-1/2 transform -translate-y-1/2"/>
                        <input
                            onChange={(e) => {setData({...data, password: e.target.value})}}
                            value={data.password}
                            id="password"
                            name="password"
                            type="password"
                            placeholder="Password"
                            className="border text-sm text-black w-full h-10 rounded-xl bg-cyan-200 pl-10 pr-3 py-2"
                            required
                        />
                    </div>
                    <div className="text-right">
                        <Link href={'/forgotPassword'} className="text-sm text-blue-600 hover:underline">Forgot password?</Link>
                    </div>
                    <div>
                    <button className="w-full px-6 py-2 mt-4 text-white bg-blue-500 rounded-lg hover:bg-blue-900">Login</button>
                    </div>
                    {error &&
                    <div className="mt-5 bg-red-500 text-white w-fit text-sm py-1 px-3 rounded-md">
                     <p>{error}</p>
                     </div>
                     }
                    <div className="text-right">
                    <Link className="text-sm mt-3" href={'register'}> Don't have an account? <span className="underline">Register</span>
                    </Link>
                    </div>
                </form>
            </div>
        </div>
  )
}


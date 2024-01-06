"use client";

import Image from "next/image"
import { User2, LockKeyhole } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Registerform () {

    const router = useRouter();
    const [error, setError] = useState(null);
    const [data, setData] = useState({
        firstName: '',
        middleName: '',
        lastName: '',
        email: '',
        schoolId: '',
        password: '',
        age: '',
    })

    const registerUser = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                const errorData = await response.json();
                setError(errorData.error || "Registration failed");
            } else {
                setError(null);
                const userInfo = await response.json();
                console.log(userInfo);
                router.push('/');
            }
        } catch (error) {
            console.error("[REGISTER]", error);
            setError("Internal Error");
        }
    };
    return (
     <div className="grid place-items-center h-screen justify-center">
            <div className="w-max max-w-md mx-auto p-6 bg-white border rounded-md shadow-sm items-center">
                <Image
                 src="/logo.png"
                 width={300}
                 height={300}
                 alt="Picture of Logo"
                 className="w-full"
                />     
                <p>Register now</p>
                <h3 className="text-2xl font-bold">Register your account</h3>
            <form onSubmit={registerUser}>
                <div className="grid grid-cols-3 gap-2">
                    <div className="relative">
                        <label htmlFor="firstName" className="mt-2 ml-1 block text-sm">First Name</label>
                        <User2 
                        className="opacity-75 absolute left-3 top-1/2 transform "/>
                        <input
                            onChange={(e) => {setData({...data, firstName: e.target.value})}}
                            value={data.firstName}
                            type="text"
                            placeholder="First Name"
                            className="border text-sm text-black w-full rounded-xl  bg-cyan-200 pl-10 pr-3 py-2"
                            required
                           />
                     </div>
                    <div className="relative">
                <label htmlFor="middlename" className="mt-2 ml-1 block text-sm">Middle Name </label>
                    <User2 
                    className="opacity-75 absolute left-3 top-1/2 transform "/>
                    <input
                        onChange={(e) => {setData({...data, middleName: e.target.value})}}                    
                        value={data.middleName}
                        type="text"
                        placeholder="Middle Name"
                        className="border text-sm text-black w-full rounded-xl  bg-cyan-200 pl-10 pr-3 py-2"
                        />
                </div>
                    <div className="relative">
                        <label htmlFor="lastname" className="mt-2 ml-1 block text-sm">Last Name</label>
                    <User2 
                    className="opacity-75 absolute left-3 top-1/2 transform"/>
                    <input
                        onChange={(e) => {setData({...data, lastName: e.target.value})}}
                        value={data.lastName}
                        type="text"
                        placeholder="Last Name"
                        className="border text-sm text-black w-full rounded-xl  bg-cyan-200 pl-10 pr-3 py-2"
                        required
                        />
                </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                    <div className="relative">
                 <label htmlFor="id" className="mt-2 ml-1 block text-sm">ID Number</label>
                    <User2 
                    className="opacity-75 absolute left-3 top-1/2 transform"/>
                    <input
                        onChange={(e) => {
                            setData({...data, schoolId: parseInt(e.target.value, 10)});
                        }}                        
                        value={data.schoolId}
                        type="number"
                        placeholder="ID number"
                        className="border text-sm text-black w-full rounded-xl  bg-cyan-200 pl-10 pr-3 py-2"
                        required
                        />
                   </div>
                    <div className="relative">
                    <label htmlFor="age" className="mt-2 ml-1 block text-sm">Age</label>
                        <User2 
                        className="opacity-75 absolute left-3 top-1/2 transform"/>
                        <input
                            onChange={(e) => {
                                setData({...data, age: parseInt(e.target.value, 10)});
                            }}
                            value={data.age}
                            type="number"
                            placeholder="Age"
                            className="border text-sm text-black w-full rounded-xl  bg-cyan-200 pl-10 pr-3 py-2"
                            required
                          />
                    </div>
                    </div>
                <div className="relative">
                <label htmlFor="email" className="mt-2 ml-1 block text-sm">Email</label>
                    <User2 
                    className="opacity-75 absolute left-3 top-1/2 transform"/>
                    <input
                        onChange={(e) => {setData({...data, email: e.target.value})}}
                        value={data.email}
                        type="text"
                        placeholder="Email"
                        className="border text-sm text-black w-full rounded-xl  bg-cyan-200 pl-10 pr-3 py-2"
                        required
                       />
                </div>
                    <div className="relative">
                <label htmlFor="password" className="mt-2 ml-4 block text-sm">Password</label>
                    <LockKeyhole className="opacity-75 absolute left-3 top-1/2 transform "/>
                    <input
                        onChange={(e) => {setData({...data, password: e.target.value})}}
                        value={data.password}
                        type="password"
                        placeholder="Password"
                        className="border text-sm text-black w-full h-10 rounded-xl bg-cyan-200 pl-10 pr-3 py-2"
                        required
                        />
                </div>
                <div className="text-right">
                    <Link 
                    href={'/forgotPassword'} 
                    className="text-sm text-blue-600 hover:underline"
                    >
                        Forgot password?
                        </Link>
                </div>
                <div>
                    <button 
                    className="w-full px-6 py-2 mt-4 text-white bg-blue-500 rounded-lg hover:bg-blue-900"
                    type="submit"
                    >
                        Register
                    </button>
                </div>
                {error && 
                <div className="mt-5 bg-red-500 text-white w-fit text-sm py-1 px-3 rounded-md">
                   {error}
                </div>
                }
                <div className="text-right">
                    <Link 
                    className="text-sm mt-3" 
                    href={'/'}
                    >
                        Have an account? <span className="underline">Login</span>
                    </Link>
                </div>
            </form>
            </div>
        </div>
    )
}
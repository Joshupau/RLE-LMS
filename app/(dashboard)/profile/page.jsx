'use client'

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"

export const ProfilePage = () => {
    const { data: session, update } = useSession();
    const data = session;
    console.log(data);

    const [userData, setUserData] = useState({
        firstName: "",
        middleName: "",
        lastName: "",
        age: "",
        schoolId: "",
        email: "",
        id: ""
    })

    useEffect(()=>{
        if (session) {
            setUserData({
                firstName: data.token?.firstName,
                middleName: data.token?.middleName,
                lastName: data.token?.lastName,
                age: data.token?.age,
                schoolId: data.token?.schoolId,
                email: data.token?.email,
                id: data.token?.id,
            })        
        } else {
            return;
        }
    },[data]);
    const handleUpdateInformation = async (event) => {
        event.preventDefault(); // Prevent default form submission

        const updatedData = {
          // Gather updated data from user input or state
          firstName: userData.firstName,
          middleName: userData.middleName,
          lastName: userData.lastName,
          age: userData.age,
          email: userData.email,
          id: userData.id, // Assuming you fetch this from session or API
        };
      
        try {
          // Send updated data to server-side API
          const response = await fetch("/api/auth/update-user", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${session.user.accessToken}`, // Assuming JWT in user object
            },
            body: JSON.stringify(updatedData),
          });
      
          if (!response.ok) {
            throw new Error("Error updating user information");
          }
      
          const updatedUserData = await response.json();
      
          // Update session using NextAuth's `update` function
          await update({
            ...session,
            user: updatedUserData, 
          });
      
          // Update local state (optional)
          setUserData(updatedUserData);
      
          // Provide success feedback to the user
        } catch (error) {
          console.error("Error updating user:", error);
          // Display error message to the user
        }
      };
  return (
    <div className="p-6">    
        <div className="flex items-center justify-between">
            <div className="flex flex-col gap-y-2">
            <h1 className="text-2xl font-medium">Basic Information</h1>
            <span className="text-sm text-slate-700">Update your basic information</span>
             </div>
            <Link href={'/schedule'}>
                <Button>
                Return
            </Button>
            </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
            <div className="overflow-x-auto gap-y-2">
            <form onSubmit={handleUpdateInformation}>      
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col space-y-2 justify-end">
                    <label for="firstName">First Name: </label>
                    <input type="text" 
                    id="firstName" 
                    placeholder="First Name" 
                    onChange={(e)=>{ setUserData({...userData, firstName: e.target.value})}} 
                    value={userData.firstName} 
                    className="border border-black text-sm text-black rounded-xl bg-slate-200 p-2" 
                     required
                    />
                </div>
                <div className="flex flex-col space-y-2 justify-end">
                    <label for="middleName">Middle Name: </label>
                    <input type="text" 
                    id="middleName" 
                    placeholder="Middle Name (Optional)" 
                    onChange={(e)=>{ setUserData({...userData, middleName: e.target.value})}} 
                    value={userData.middleName} 
                    className="border border-black text-sm text-black rounded-xl bg-slate-200 p-2" />
                </div>
                <div className="flex flex-col space-y-2 justify-end">
                    <label for="lastName">Last Name: </label>
                    <input type="text"
                     id="lastName" 
                     placeholder="Last Name" 
                     onChange={(e)=>{ setUserData({...userData, lastName: e.target.value})}} 
                     value={userData.lastName} 
                     className="border border-black text-sm text-black rounded-xl bg-slate-200 p-2" 
                     required
                     />
                </div>
                <div className="flex flex-col space-y-2 justify-end">
                    <label for="Email">Email: </label>
                    <input type="text" 
                    id="Email" 
                    placeholder="Email"
                    onChange={(e)=>{ setUserData({...userData, email: e.target.value})}} 
                    value={userData.email} 
                    className="border border-black text-sm text-black rounded-xl bg-slate-200 p-2" 
                    required
                    />
                </div>
                <div className="flex flex-col space-y-2 justify-end">
                    <label for="Age">Age: </label>
                    <input type="number" 
                    id="Age" 
                    placeholder="Age" 
                    onChange={(e)=>{ setUserData({...userData, age: e.target.value})}} 
                    value={userData.age} 
                    className="border border-black text-sm text-black rounded-xl bg-slate-200 p-2" 
                    required
                    />
                </div>
                <div className="flex flex-col space-y-2 justify-end">
                    <label for="idNumber">ID Number: </label>
                    <input type="text" 
                    id="idNumber" 
                    placeholder="ID Number" 
                    value={userData.schoolId} 
                    className="border border-black text-sm text-black rounded-xl bg-slate-200 p-2" 
                    readOnly />
                </div>
            </div>
                <div className="flex m-4 justify-end">
                    <Button type="submit">Update your Information</Button>
                </div>
            </form>
            </div>
        </div>
  </div>
  )
}

export default ProfilePage
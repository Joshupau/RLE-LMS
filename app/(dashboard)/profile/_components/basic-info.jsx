'use client'

import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"

export const BasicInfo = ({ data }) => {

    const { toast } = useToast();

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
        if (data) {
            setUserData({
                firstName: data.firstName,
                middleName: data.middleName,
                lastName: data.lastName,
                age: data.age,
                schoolId: data.schoolId,
                email: data.email,
                id: data.id,
            })        
        } else {
            return;
        }
    },[data]);
    const handleUpdateInformation = async (event) => {
        event.preventDefault(); 

        const updatedData = {
          firstName: userData.firstName,
          middleName: userData.middleName,
          lastName: userData.lastName,
          age: userData.age,
          email: userData.email,
          id: userData.id, 
        };
      
        try {
          const response = await fetch("/api/auth/update-user", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedData),
          });
      
          if (!response.ok) {
            toast({
                title: "Uh oh...",
                description: "Failed to update Basic Information.",
                status: "failed",
            });
            throw new Error("Error updating user information");
          }
      
          const updatedUserData = await response.json();
      
          setUserData(updatedUserData);
          toast({
            title: "Success",
            description: "Succesfully updated your Basic Information.",
            status: "failed",
        });
      
        } catch (error) {
          console.error("Error updating user:", error);
          toast({
            title: "Uh oh...",
            description: "Failed to update Basic Information. Please try again later.",
            status: "failed",
        });
        }
      };
    return (
        <>
        <form onSubmit={handleUpdateInformation}>      
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex flex-col space-y-2 justify-end">
                    <label htmlFor="firstName">First Name: </label>
                    <Input type="text" 
                    id="firstName" 
                    placeholder="First Name" 
                    onChange={(e)=>{ setUserData({...userData, firstName: e.target.value})}} 
                    value={userData.firstName} 
                    className="border border-black text-sm text-black rounded-xl bg-slate-200 p-2" 
                     required
                    />
                </div>
                <div className="flex flex-col space-y-2 justify-end">
                    <label htmlFor="middleName">Middle Name: </label>
                    <Input type="text" 
                    id="middleName" 
                    placeholder="Middle Name (Optional)" 
                    onChange={(e)=>{ setUserData({...userData, middleName: e.target.value})}} 
                    value={userData.middleName} 
                    className="border border-black text-sm text-black rounded-xl bg-slate-200 p-2" />
                </div>
                <div className="flex flex-col space-y-2 justify-end">
                    <label htmlFor="lastName">Last Name: </label>
                    <Input type="text"
                     id="lastName" 
                     placeholder="Last Name" 
                     onChange={(e)=>{ setUserData({...userData, lastName: e.target.value})}} 
                     value={userData.lastName} 
                     className="border border-black text-sm text-black rounded-xl bg-slate-200 p-2" 
                     required
                     />
                </div>
                <div className="flex flex-col space-y-2 justify-end">
                    <label htmlFor="Email">Email: </label>
                    <Input type="text" 
                    id="Email" 
                    placeholder="Email"
                    onChange={(e)=>{ setUserData({...userData, email: e.target.value})}} 
                    value={userData.email} 
                    className="border border-black text-sm text-black rounded-xl bg-slate-200 p-2" 
                    required
                    />
                </div>
                <div className="flex flex-col space-y-2 justify-end">
                    <label htmlFor="Age">Age: </label>
                    <Input type="number" 
                    id="Age" 
                    placeholder="Age" 
                    onChange={(e)=>{ setUserData({...userData, age: e.target.value})}} 
                    value={userData.age} 
                    className="border border-black text-sm text-black rounded-xl bg-slate-200 p-2" 
                    required
                    />
                </div>
                <div className="flex flex-col space-y-2 justify-end">
                    <label htmlFor="idNumber">ID Number: </label>
                    <Input type="text" 
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
        </>
    )
}


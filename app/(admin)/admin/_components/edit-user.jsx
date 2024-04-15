'use client'

import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";

export const EditUser = ({user}) => {
    const { toast } = useToast();

    const [userInfo, setUserInfo] = useState({
        firstName: "",
        middleName: "",
        lastName: "",
        schoolId: "",
        email: "",
        password: "",
        age: "",
        role: "",
        yearLevel: "",
        section: "",
        group: "",
        status: "",
    });

    useEffect(()=> {
        setUserInfo({
            firstName: user.firstName,
            middleName: user.middleName,
            lastName: user.lastName,
            schoolId: Number(user.schoolId),
            email: user.email,
            age: Number(user.age),
            role: user.role,
            yearLevel: Number(user.yearLevel) || "",
            section: user.section || "",
            group: user.group || "",
            status: user.status.toString(),
        })
    }, [])

    
    const handleUpdateUser = async () => {
        try {
            const response = await fetch('/api/auth/', {
                method: "POST",
                "Content-Type": "application/json",
                body: JSON.stringify(userInfo)
            });

            if(response.ok){
                toast({
                    title: "Success",
                    description: "Successfully created a user.",
                    status: "Success"
                });
            } else {
                toast({
                    title: "Failed",
                    description: "Failed to create a user.",
                    status: "Destructive"
                });
            }
            setUserInfo({
                firstName: "",
                middleName: "",
                lastName: "",
                schoolId: "",
                email: "",
                password: "",
                age: "",
                role: "",
                yearLevel: "",
                section: "",
                group: "",
            });
            } catch (error) {
            console.error("Failed to create a user: ",error)
            toast({
                title: "Failed",
                description: "Failed to create a user.",
                status: "Destructive"
            });
        }
    }
    return (
        <>
                    <div className="grid grid-cols-2 gap-2">
                        <div>
                            <Label>First Name</Label>
                            <Input 
                            onChange={(e)=> setUserInfo({...userInfo, firstName: e.target.value})}
                            value={userInfo.firstName}
                            placeholder="First Name"
                            disabled
                            />
                        </div>
                        <div>
                            <Label>Middle Name</Label>
                            <Input
                            onChange={(e)=> setUserInfo({...userInfo, middleName: e.target.value})}
                            value={userInfo.middleName}                            
                            placeholder="Middle Name"
                            disabled
                            />
                        </div>                    
                        <div>
                            <Label>Last Name</Label>
                            <Input
                            onChange={(e)=> setUserInfo({...userInfo, lastName: e.target.value})}
                            value={userInfo.lastName} 
                            placeholder="Last Name"
                            disabled

                            />
                        </div>
                        <div>
                            <Label>ID Number</Label>
                            <Input 
                            onChange={(e)=> setUserInfo({...userInfo, schoolId: e.target.value})}
                            value={userInfo.schoolId}                            
                            placeholder="ID Number"
                            type="number"
                            disabled
                            />
                        </div>
                        <div>
                            <Label>Email</Label>
                            <Input 
                            onChange={(e)=> setUserInfo({...userInfo, email: e.target.value})}
                            value={userInfo.email}                           
                            placeholder="Email"
                            disabled
                            />
                        </div>
                        <div>
                            <Label>Age</Label>
                            <Input 
                            onChange={(e)=> setUserInfo({...userInfo, age: e.target.value})}
                            value={userInfo.age}                            
                            placeholder="Age"
                            type="number"
                            disabled
                            />
                        </div>                        
                            <div>
                            <Label>Status</Label>
                            <Select value={userInfo.status} onValueChange={(e)=> setUserInfo({...userInfo, status: e})}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Status"/>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="true">Active</SelectItem>
                                    <SelectItem value="false">Inactive</SelectItem>
                                </SelectContent>
                            </Select>                         
                            </div>    
                        <div>
                            <Label>Role</Label>
                            <Select value={userInfo.role} onValueChange={(e)=> setUserInfo({...userInfo, role: e})}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Role"/>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Student">Student</SelectItem>
                                    <SelectItem value="ClinicalInstructor">Clinical Instructor</SelectItem>
                                    <SelectItem value="Dean">Dean</SelectItem>
                                    <SelectItem value="SystemAdmin">System Admin</SelectItem>
                                </SelectContent>
                            </Select>                        
                            </div>

                        </div>
                        <DialogClose className="flex justify-end">
                            <Button onClick={handleUpdateUser} type="submit">Update User</Button>
                        </DialogClose>            
        </>
    )
}
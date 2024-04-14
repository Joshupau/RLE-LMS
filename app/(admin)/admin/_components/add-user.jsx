'use client'

import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";


export const AddUser = () => {

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
    });

    const handleAddUser = async () => {
        try {
            const response = await fetch('/api/register', {
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
                    <Dialog>
                <DialogTrigger asChild>
                    <Button>Add User</Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add user information</DialogTitle>
                    </DialogHeader>
                    <div className="grid grid-cols-2 gap-2">
                        <div>
                            <Label>First Name</Label>
                            <Input 
                            onChange={(e)=> setUserInfo({...userInfo, firstName: e.target.value})}
                            value={userInfo.firstName}
                            placeholder="First Name"
                            />
                        </div>
                        <div>
                            <Label>Middle Name</Label>
                            <Input
                            onChange={(e)=> setUserInfo({...userInfo, middleName: e.target.value})}
                            value={userInfo.middleName}                            
                            placeholder="Middle Name"
                            />
                        </div>                    
                        <div>
                            <Label>Last Name</Label>
                            <Input
                            onChange={(e)=> setUserInfo({...userInfo, lastName: e.target.value})}
                            value={userInfo.lastName} 
                            placeholder="Last Name"
                            />
                        </div>
                        <div>
                            <Label>ID Number</Label>
                            <Input 
                            onChange={(e)=> setUserInfo({...userInfo, schoolId: e.target.value})}
                            value={userInfo.schoolId}                            
                            placeholder="ID Number"
                            type="number"
                            />
                        </div>
                        <div>
                            <Label>Email</Label>
                            <Input 
                            onChange={(e)=> setUserInfo({...userInfo, email: e.target.value})}
                            value={userInfo.email}                           
                            placeholder="Email"
                            />
                        </div>
                        <div>
                            <Label>Age</Label>
                            <Input 
                            onChange={(e)=> setUserInfo({...userInfo, age: e.target.value})}
                            value={userInfo.age}                            
                            placeholder="Age"
                            type="number"
                            />
                        </div> 
                        <div>
                            <Label>Password</Label>
                            <Input
                            onChange={(e)=> setUserInfo({...userInfo, password: e.target.value})}
                            value={userInfo.password}                            
                            type="password" 
                            placeholder="Password"
                            />
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
                        <div>
                            <Label>Year Level(Optional)</Label>
                            <Select value={userInfo.yearLevel} onValueChange={(e)=> setUserInfo({...userInfo, yearLevel: e})}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Year Level"/>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="1">1st Year</SelectItem>
                                    <SelectItem value="2">2nd Year</SelectItem>
                                    <SelectItem value="3">3rd Year</SelectItem>
                                    <SelectItem value="4">4th Year</SelectItem>
                                </SelectContent>
                            </Select>                    
                            </div> 
                        <div>
                            <Label>Group(Optional)</Label>
                            <Select value={userInfo.group} onValueChange={(e)=> setUserInfo({...userInfo, group: e})}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Group"/>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="A">Group A</SelectItem>
                                    <SelectItem value="B">Group B</SelectItem>
                                </SelectContent>
                            </Select>                         
                            </div>    
                        <div>
                            <Label>Section</Label>
                            <Input 
                            onChange={(e)=> setUserInfo({...userInfo, section: e.target.value})}
                            value={userInfo.section}                            
                            placeholder="Section"
                            type="number"
                            />
                        </div> 
                        </div>
                        <DialogClose className="flex justify-end">
                            <Button onClick={handleAddUser} type="submit">Submit</Button>
                        </DialogClose>
                </DialogContent>
            </Dialog>
        </>
    )
}
'use client'

import { useState } from "react";
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";

export const AddSchoolYear = () => {
    const [schoolStart, setSchoolStart] = useState('');
    const [schoolEnd, setSchoolEnd] = useState('');
    const [semester, setSemester] = useState('');

    const { toast } = useToast();

    const handleSubmit = async () => {
        try {
            
        if (!schoolStart || !schoolEnd || !semester) {
            alert("Please fill in all fields");
            return;
        }

        const schoolyear = `${schoolStart}-${schoolEnd}`
        const formData = {
            schoolyear,
            semester
        };

        const response = await fetch('/api/schoolyear',{
            method: "POST",
            "Content-Type": "application/json",
            body: JSON.stringify(formData),
        });

        if(response.ok){
            toast({
                title: "Success",
                description: "Successfully created a new school year",
                status: "Success"
            });
        } else{
            toast({
                title: "Uh oh...",
                description: "Failed to create a new school year",
                status: "Failed"
            });
        }
    } catch (error) {
        toast({
            title: "Uh oh...",
            description: "Failed to create a new school year",
            status: "Failed"
        });

    } finally {
        setSchoolStart('');
        setSchoolEnd('');
        setSemester('');
    }
    };

    return (
        <>
            <Dialog>
                <DialogTrigger asChild>
                    <Button>Add School Year/Semester</Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add New School Year and Semester</DialogTitle>
                    </DialogHeader>
                    <div className="grid grid-cols-2 gap-2">
                        <Input
                            placeholder="Start of School Year"
                            type="number"
                            value={schoolStart}
                            onChange={(e) => setSchoolStart(e.target.value)}
                            required
                        />
                        <Input
                            placeholder="End of School Year"
                            type="number"
                            value={schoolEnd}
                            onChange={(e) => setSchoolEnd(e.target.value)}
                            required
                        />
                    </div>
                    <Select onValueChange={(e)=> setSemester(e)}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select Semester" value={semester} />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="1">1st Semester</SelectItem>
                            <SelectItem value="2">2nd Semester</SelectItem>
                            <SelectItem value="3">3rd Semester</SelectItem>
                        </SelectContent>
                    </Select>
                    <DialogClose>
                    <Button onClick={handleSubmit}>Submit</Button>
                    </DialogClose>
                </DialogContent>
            </Dialog>
        </>
    );
};

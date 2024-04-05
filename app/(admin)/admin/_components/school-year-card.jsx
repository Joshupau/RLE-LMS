'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectTrigger, SelectValue, SelectItem, SelectContent } from "@/components/ui/select";
import { useState } from "react";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog"
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
  

export const Schoolyearcard = ({ schoolyear }) => {

    const { toast } = useToast();

    const getCurrentSchoolYear = (schoolyears) => {
        return schoolyears.find((year) => year.current === true);
    };
    
    const currentSchoolYear = getCurrentSchoolYear(schoolyear);
    const [selectedSchoolYear, setSelectedSchoolYear] = useState(currentSchoolYear ? currentSchoolYear.id : '');

    const handleSchoolYearChange = (event) => {
        setSelectedSchoolYear(event);
    };

    const handleChange = async () => {
        try {
            const response = await fetch('/api/schoolyear/update',{
                method: "POST",
                "Content-Type": "application/json",
                body: JSON.stringify({
                    schoolyearId: selectedSchoolYear,
                })
            })
            if(response.ok){
                toast({
                    title: "Success",
                    description: "Successfully updated the school year.",
                    status: "Success"
                });
            } else {
                toast({
                    title: "Failed",
                    description: "Failed to update the school year.",
                    status: "Failed"
                });
            }
        } catch (error) {
            toast({
                title: "Failed",
                description: "Failed to update the school year.",
                status: "Failed"
            });   
        }
    }
    
    return (
        <>
        <Card>
            <CardHeader>
                <CardTitle>
                Current School year: {currentSchoolYear ? `${currentSchoolYear.schoolyear} - Semester ${currentSchoolYear.semester}` : "No school year selected"}
                </CardTitle>
            </CardHeader>
            <CardContent>
            <Select  onValueChange={handleSchoolYearChange}>
                    <SelectTrigger>
                        <SelectValue value={selectedSchoolYear} placeholder="Select School Year" />
                    </SelectTrigger>
                    <SelectContent>
                        {schoolyear.map((year) => (
                            <SelectItem key={year.id} value={year.id}>
                                {year.schoolyear} - {year.semester}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            <div className="flex justify-end mt-4">
                <AlertDialog>
                <AlertDialogTrigger>
                    <Button>
                        Submit
                    </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action can interrupt the system during a school year.
                    </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleChange}>Continue</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
                </AlertDialog>
            </div>

            </CardContent>
        </Card>
        </>
    )
}
import { useState } from "react"

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"

  import { Button } from "@/components/ui/button";

import { DialogClose } from "@/components/ui/dialog";

export const TransferStudent = ({data, schedules, onTransferStatusChange}) => {
    
    const [scheduleSelect, setScheduleSelect] = useState("");

    const handleScheduleSelect = (e) =>{
        setScheduleSelect(e);
    }
    const handleTransfer = async () => {
        try {
            const response = await fetch(`/api/schedule/${scheduleSelect}/transfer`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: data.id,
                    selectId: scheduleSelect,
                    oldId: data.scheduleId,
                })
            });
        
            if (response.ok) {
                onTransferStatusChange(true);
            } else {
                onTransferStatusChange(false);
            }
    
        } catch (error) {
            console.error(error);
            onTransferStatusChange(false);
        }
    }
    

    return (
        <>
            <div>
                <div className="mb-4">
                    <p>    
                        Transfer {data.name} to another schedule
                    </p> 
                </div>
                <div>
                <Select onValueChange={(e) => handleScheduleSelect(e)}>
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Week" />
                    </SelectTrigger>
                    <SelectContent  className="overflow-y-auto max-h-[20rem]">
                        <SelectGroup>
                        {schedules.map((schedule) => (
                            <SelectItem key={schedule.id} value={schedule.id}>
                            {`Week ${schedule.week} - ${schedule.user.find((user) => user.role === 'ClinicalInstructor').firstName} ${schedule.user.find((user) => user.role === 'ClinicalInstructor').lastName} - ${schedule.area}`}
                            {schedule.id === data.scheduleId && '(Current)'}
                            </SelectItem>
                        ))}
                        </SelectGroup>
                    </SelectContent>
                    </Select>
                </div>
                <div className="flex justify-end mt-4">
                    <DialogClose>
                        <Button onClick={handleTransfer}>
                            Transfer
                        </Button>
                    </DialogClose>
                </div>
            </div>
        </>
    )
}
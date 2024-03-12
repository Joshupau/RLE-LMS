
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"

import { useState } from "react"
export const DRCordCareField = () => {
    return (
        <>
        <div className="flex flex-col space-y-2 justify-end">
            <Input
              type="text"
              placeholder="Name of Baby"
              />
          </div>
          <div className="flex flex-col space-y-2 justify-end">
          <Select>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Sex" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Sex(Baby)</SelectLabel>
                <SelectItem value="Male">Male</SelectItem>
                <SelectItem value="Female">Female</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          </div>
          <div className="flex flex-col space-y-2 justify-end">
            <Input
              type="number"
              placeholder="APGAR Score"
              />
          </div>
          <div className="flex flex-col space-y-2 justify-end">
            <Input
              type="text"
              placeholder="Name of Mother"
              />
          </div> 
          <div className="flex flex-col space-y-2 justify-end">
            <Input
              type="number"
              placeholder="Age"
              />
          </div> 
          <div className="flex flex-col space-y-2 justify-end">
            <Input
              type="text"
              placeholder="Staff on Duty"
              />
          </div> 
          <div className="flex flex-col space-y-2 justify-end">
            <Input
              type="text"
              placeholder="Name of Hospital/Agency"
              />
          </div>
        </>
    )
}
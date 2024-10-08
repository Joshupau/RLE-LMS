import { useState, useEffect, useMemo } from "react";

import { 
Select,
SelectContent,
SelectTrigger,
SelectItem,
SelectValue,
SelectGroup,
} from "@/components/ui/select";

import { Label } from "@/components/ui/label";


export const ClinicalInstructorSelect = ({ onSelectInstructor, clinicalInstructor }) => {
  const [clinicalInstructors, setClinicalInstructors] = useState(clinicalInstructor) // Initialize clinical instructors state
  const [selectedInstructorId, setSelectedInstructorId] = useState(""); // Add state for selected instructor ID

  
  const selectedInstructor = useMemo(
    () => clinicalInstructors.find((instructor) => instructor.id === selectedInstructorId),
    [clinicalInstructors, selectedInstructorId]
  );

  useEffect(() => {
    if (selectedInstructor && onSelectInstructor) {
      onSelectInstructor(selectedInstructor);
    }
  }, [selectedInstructor, onSelectInstructor]);

  if (clinicalInstructors.length === 0) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <Label className="mb-2 text-md" htmlFor="instructor">Select Clinical Instructor:</Label>
      <Select
        id="instructor"
        onValueChange={(e) => setSelectedInstructorId(e)}
        aria-label="Select Clinical Instructor"
        value={selectedInstructorId}
      >
        <SelectTrigger className="w-[20rem]">
          <SelectValue placeholder="Clinical Instructor"/>
        </SelectTrigger>
        <SelectContent>

        {clinicalInstructors.map((instructor) => (
          <SelectItem key={instructor.id} value={instructor.id}>
            {`${instructor.firstName} ${instructor.lastName}`}
          </SelectItem>
        ))}
        </SelectContent>
      </Select>
    </>
  );
};

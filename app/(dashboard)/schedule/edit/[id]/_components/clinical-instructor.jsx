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
  

export const ClinicalInstructorSelect = ({ onSelectInstructor, value, clinicalInstructor }) => {
  const [clinicalInstructors, setClinicalInstructors] = useState([]); 
  const [selectedInstructorId, setSelectedInstructorId] = useState(); 

  useEffect(() => {
    setClinicalInstructors(clinicalInstructor)
    setSelectedInstructorId(value.id);
  }, [value]); 

  
const selectedInstructor = useMemo(
  () => {
    if (selectedInstructorId !== undefined) {
      return clinicalInstructors.find((instructor) => instructor.id === selectedInstructorId);
    }
    return null; // Return null if selectedInstructorId is undefined
  },
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

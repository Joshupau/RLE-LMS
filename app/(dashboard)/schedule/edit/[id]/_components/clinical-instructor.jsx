import { useState, useEffect, useMemo } from "react";

export const ClinicalInstructorSelect = ({ onSelectInstructor, value, clinicalInstructor }) => {
  const [clinicalInstructors, setClinicalInstructors] = useState([]); // Initialize clinical instructors state
  const [selectedInstructorId, setSelectedInstructorId] = useState(""); // Add state for selected instructor ID

  useEffect(() => {
    setClinicalInstructors(clinicalInstructor)
    setSelectedInstructorId(value);
  }, [clinicalInstructor, value]); 
  
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
      <label htmlFor="instructor">Clinical Instructor:</label>
      <select
        id="instructor"
        value={selectedInstructorId}
        onChange={(e) => setSelectedInstructorId(e.target.value)}
        aria-label="Select Clinical Instructor"
      >
        <option value="">
          Select Clinical Instructor
        </option>
        {clinicalInstructors.map((instructor) => (
          <option key={instructor.id} value={instructor.id}>
            {`${instructor.firstName} ${instructor.lastName}`}
          </option>
        ))}
      </select>
    </>
  );
};

import { useEffect, useState } from "react";

export const StudentList = ({
  selectedGroup,
  selectedYearLevel,
  students,
  onSelectStudents,
  value,
}) => {
  const [selectedStudents, setSelectedStudents] = useState([]);

  useEffect(() => {
    setSelectedStudents(value);
  }, [value]);

  const handleStudentSelect = (studentId) => {
    const isSelected = selectedStudents.includes(studentId);
    const updatedStudents = isSelected
      ? selectedStudents.filter((id) => id !== studentId)
      : [...selectedStudents, studentId];
    setSelectedStudents(updatedStudents);
    onSelectStudents(updatedStudents);
  };

  const handleSelectAll = () => {
    const allStudentIds = students
      .filter(
        (student) =>
          (!selectedGroup || student.group === selectedGroup) &&
          (!selectedYearLevel || student.yearLevel === selectedYearLevel)
      )
      .map((student) => student.id);
    const newSelectedStudents =
      selectedStudents.length === allStudentIds.length ? [] : allStudentIds;
    setSelectedStudents(newSelectedStudents);
    onSelectStudents(newSelectedStudents);
  };

  return (
    <>
      <div className="flex flex-col w-full">
        <h2 className="text-lg font-bold mb-4">Student List</h2>
        <table className="table-auto w-full shadow-md rounded-md text-sm">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Year Level</th>
              <th className="px-4 py-2 text-left">Group</th>
              <th className="px-4 py-2 text-left">Section</th>
              <th className="px-4 py-2 text-right">
                <div className="flex items-center justify-end">
                  <span className="mr-2">Select All</span>
                  <input
                    type="checkbox"
                    checked={
                      selectedStudents.length ===
                      students.filter(
                        (student) =>
                          (!selectedGroup || student.group === selectedGroup) &&
                          (!selectedYearLevel ||
                            student.yearLevel === selectedYearLevel)
                      ).length
                    }
                    onChange={handleSelectAll}
                  />
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {students &&
              students.map((student) => (
                (student.group === selectedGroup || !selectedGroup) &&
                (student.yearLevel === selectedYearLevel || !selectedYearLevel) && (
                  <tr key={student.id} className="hover:bg-gray-100">
                    <td className="px-4 py-2">{`${student.firstName} ${student.lastName}`}</td>
                    <td className="px-4 py-2">{student.yearLevel}</td>
                    <td className="px-4 py-2">{student.group}</td>
                    <td className="px-4 py-2">{student.section}</td>
                    <td className="px-4 py-2 flex items-center justify-end">
                      <input
                        type="checkbox"
                        checked={selectedStudents.includes(student.id)}
                        onChange={() => handleStudentSelect(student.id)}
                        value={student.id}
                      />
                    </td>
                  </tr>
                )
              ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

'use client'
import {
    Table,
    TableHead,
    TableHeader,
    TableRow,
    TableBody,
    TableCell
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
useReactTable,
getPaginationRowModel,
getCoreRowModel,
getFilteredRowModel,
 } from "@tanstack/react-table";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
  

const DebouncedInput = ({ value: initialValue, onChange, debounceTime = 300 }) => {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    const handler = setTimeout(() => {
      onChange(value);
    }, debounceTime);

    return () => {
      clearTimeout(handler);
    };
  }, [value, onChange, debounceTime]);

  return <Input value={value} onChange={e => setValue(e.target.value)} placeholder="Search..." />;
};

const fuzzyFilterFn = (rows, filterValue) => {
  return rows.filter(row => {
    const rowValues = Object.values(row).map(value =>
      typeof value === 'string' ? value.toLowerCase() : value
    );
    return rowValues.some(value =>
      value.toString().toLowerCase().includes(filterValue.toLowerCase())
    );
  });
};

const PR4DataTable = ({ data }) => {
  
  const [pagination, setPagination] = useState({
    pageIndex: 0, // Initial page index
    pageSize: 5, // Default page size
  });
  const [globalFilter, setGlobalFilter] = useState('');

  const table = useReactTable({
    data,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    state: {
      pagination,
      globalFilter,
    },
    globalFilterFn: fuzzyFilterFn,
  });

  const paginatedFilteredData = data
    .filter(row => { 
      return fuzzyFilterFn([row], globalFilter).length > 0;
    })
    .slice(
      pagination.pageIndex * pagination.pageSize,
      (pagination.pageIndex + 1) * pagination.pageSize
    );

  return (
    <>
  <div className="flex justify-end">
    <div className="w-1/4 max-w-xs m-2">
      <DebouncedInput value={globalFilter} onChange={setGlobalFilter} />
    </div>
  </div>
    <div className="overflow-x-auto rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
          <TableHead className="text-center">Student Names</TableHead>
            <TableHead className="text-center">Medical</TableHead>
            <TableHead className="text-center">Pediatrics</TableHead>
            <TableHead className="text-center">Communicable Diseases</TableHead>
            <TableHead className="text-center">Obstetrics</TableHead>
            <TableHead className="text-center">Surgical</TableHead>
            <TableHead className="text-center">Medical Surgical Intensive</TableHead>
            <TableHead className="text-center">Orthopedics</TableHead>
            <TableHead className="text-center">Gynecology</TableHead>
            <TableHead className="text-center">EENT</TableHead>
            <TableHead className="text-center">Nursery</TableHead>
            <TableHead className="text-center">Psychiatric</TableHead>
            <TableHead className="text-center">OR Major</TableHead>
            <TableHead className="text-center">OR Minor</TableHead>
            <TableHead className="text-center">DR Manage</TableHead>
            <TableHead className="text-center">DR Assist</TableHead>
            <TableHead className="text-center">DR Cord Care</TableHead>
            <TableHead className="text-center">CHN</TableHead>
            <TableHead className="text-center">Total</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedFilteredData.map((student) => (
            <TableRow key={student.id}>
              <TableCell className="text-center">{student.firstName} {student.lastName}</TableCell>
              {Object.entries(student.progressReport['4']).map(([caseType, status]) => (
            <TableCell key={caseType} className="text-center">
                {status}%
            </TableCell>
        ))}           
         </TableRow>
          ))}
        </TableBody>
      </Table>
      
      <div className="flex items-center justify-end space-x-2 py-4 mx-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          >
          Next
        </Button>
      </div>
    </div>
          </>
  );
};

export default PR4DataTable;
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

const DataTable = ({ data }) => {
  
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
            <TableHead className="text-center">Case Number</TableHead>
            <TableHead className="text-center">Case Type</TableHead>
            <TableHead className="text-center">Level</TableHead>
            <TableHead className="text-center">Date</TableHead>
            <TableHead className="text-center">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedFilteredData.map((Case) => (
            <TableRow key={Case.id}>
              <TableCell className="text-center">{Case.caseNumber}</TableCell>
              <TableCell className="text-center">{Case.caseType}</TableCell>
              <TableCell className="text-center">{Case.level}</TableCell>
              <TableCell className="text-center">{new Date(Case.date).toLocaleDateString()}</TableCell>
              <TableCell className="text-center">{Case.status ? <Badge variant="outline" className="bg-cyan-200 text-blue-500">Approved</Badge> : <Badge variant="outline" className="bg-red-200 text-red-500">Pending</Badge>}</TableCell>
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

export default DataTable;
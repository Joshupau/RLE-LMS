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
 } from "@tanstack/react-table";
import { useState } from "react";
  
const DataTable = ({ data }) => {
    const [pagination, setPagination] = useState({
      pageIndex: 0, // Initial page index
      pageSize: 10, // Default page size
    });
  
    const table = useReactTable({
      data,
      getCoreRowModel: getCoreRowModel(),
      getPaginationRowModel: getPaginationRowModel(),
      onPaginationChange: setPagination,
      state: {
        pagination,
      },
    });
  
    // Slice the data array based on pagination settings
    const paginatedData = data.slice(
      pagination.pageIndex * pagination.pageSize,
      (pagination.pageIndex + 1) * pagination.pageSize
    );
  
    return (
      <div className="overflow-x-auto rounded-md border">
        <Table>
          <TableHeader>
            <TableRow className="bg-blue-400 hover:bg-blue-400">
              <TableHead className="text-center text-white">ID number</TableHead>
              <TableHead className="text-center text-white">Full Name</TableHead>
              <TableHead className="text-center text-white">Email</TableHead>
              <TableHead className="text-center text-white">Age</TableHead>
              <TableHead className="text-center text-white">status</TableHead>
              <TableHead className="text-center text-white">role</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="text-center">{user.schoolId}</TableCell>
                <TableCell className="text-center">{user.firstName} {user?.middleName} {user.lastName}</TableCell>
                <TableCell className="text-center">{user.email}</TableCell>
                <TableCell className="text-center">{user.age}</TableCell>
                <TableCell className="text-center">{user.status ? <Badge variant="outline" className="bg-cyan-200 text-blue-500">Active</Badge> : <Badge variant="outline" className="bg-red-200 text-red-500">Disabled</Badge>}</TableCell>
                <TableCell className="text-center">{user.role}</TableCell>
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
    );
  };
  
  export default DataTable;
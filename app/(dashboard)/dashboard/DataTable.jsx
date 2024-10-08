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
      pageSize: 5, // Default page size
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
            <TableRow>
              <TableHead className="text-center">Case Number</TableHead>
              <TableHead className="text-center">Case Type</TableHead>
              <TableHead className="text-center">Level</TableHead>
              <TableHead className="text-center">Date</TableHead>
              <TableHead className="text-center">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.map((Case) => (
              <TableRow key={Case.id}>
                <TableCell className="text-center">{Case.caseNumber}</TableCell>
                <TableCell className="text-center">{Case.caseType}</TableCell>
                <TableCell className="text-center">{Case.level}</TableCell>
                <TableCell className="text-center">{new Date(Case.date).toLocaleDateString()}</TableCell>
                <TableCell className="text-center">
                <Badge
                  variant="outline"
                  className={
                    Case.statusMigrate === 'PENDING' ? 'bg-blue-500 text-white' :
                    Case.statusMigrate === 'APPROVED' ? 'bg-green-500 text-white' :
                    Case.statusMigrate === 'DISAPPROVED' ? 'bg-red-600 text-white' :
                    'bg-gray-200 text-gray-600'
                  }
                >
                  {Case.statusMigrate}
                </Badge>
                  </TableCell>
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
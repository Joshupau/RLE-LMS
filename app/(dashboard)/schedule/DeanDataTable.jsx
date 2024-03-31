'use client'

import {
    Table,
    TableHead,
    TableHeader,
    TableRow,
    TableBody,
    TableCell,
  } from "@/components/ui/table";
  import { Button } from "@/components/ui/button";
  import { useReactTable, getPaginationRowModel, getCoreRowModel } from "@tanstack/react-table";
  import { useState } from "react";

  import ScheduleItem from "./_components/schedule-item";
  
  const DeanDataTable = ({ data }) => {
    const [pagination, setPagination] = useState({
      pageIndex: 0,
      pageSize: 10,
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
  
    const paginatedData = data.slice(
      pagination.pageIndex * pagination.pageSize,
      (pagination.pageIndex + 1) * pagination.pageSize
    );
  
    return (
      <div className="overflow-x-auto rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-center">Date/s</TableHead>
              <TableHead className="text-center">Clinical Instructor</TableHead>
              <TableHead className="text-center">Area</TableHead>
              <TableHead className="text-center">Group</TableHead>
              <TableHead className="text-center">Year Level</TableHead>
              <TableHead className="text-center">Hours</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.map((schedule) => (
              <ScheduleItem
                key={schedule.id}
                id={schedule.id}
                dateFrom={schedule.dateFrom}
                dateTo={schedule.dateTo}
                user={schedule.user}
                area={schedule.area}
                clinicalHours={schedule.clinicalHours}
                groupId={schedule.groupId}
                yearLevel={schedule.yearLevel}
              />
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
  
  export default DeanDataTable;
  
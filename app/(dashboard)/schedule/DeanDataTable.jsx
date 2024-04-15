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


  import { DeanPdfTemplate } from "./_components/dean-pdf-template";


  import generatePDF, { Resolution, Margin } from "react-to-pdf";
  const options = {
    filename: "schedule.pdf",
    method: "save",

    resolution: Resolution.MEDIUM,
    page: {
      margin: Margin.SMALL,
      format: "tabloid",
      orientation: "landscape",
    },
    canvas: {
      mimeType: "image/png",
      qualityRatio: 1,
    },

    overrides: {
      pdf: {
        compress: true,
      },
      canvas: {
        useCORS: true,
      },
    },
  };
  
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

    const openPDF = () => {
      generatePDF(() => document.getElementById("content-id"), options);
    };
  
    return (
      <>
         <div className="flex justify-end m-2">
                <Button variant="secondary" onClick={openPDF}>
                    Export Schedule
                </Button>
            </div>
                <div
                className="w-full h-full"         
                style={{
                  position: 'absolute',
                  left: '-9999px',
                  top: '-9999px',
              }} id="content-id">
                    <DeanPdfTemplate data={data}/>
                </div>
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
              clinicalArea={schedule.clinicalArea}
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
      </>
    );
  };
  
  export default DeanDataTable;
  
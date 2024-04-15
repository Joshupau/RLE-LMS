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


import generatePDF, { Resolution, Margin } from 'react-to-pdf';
import { DeanPdfTemplate } from "./_components/dean-pdf-template";
import { useRef } from "react";

const options = {
   // default is `save`
   method: 'open',
   // default is Resolution.MEDIUM = 3, which should be enough, higher values
   // increases the image quality but also the size of the PDF, so be careful
   // using values higher than 10 when having multiple pages generated, it
   // might cause the page to crash or hang.
   resolution: Resolution.HIGH,
   page: {
      // margin is in MM, default is Margin.NONE = 0
      margin: Margin.SMALL,
      // default is 'A4'
      format: 'letter',
      // default is 'portrait'
      orientation: 'landscape',
   },
   canvas: {
      // default is 'image/jpeg' for better size performance
      mimeType: 'image/png',
      qualityRatio: 1
   },
   // Customize any value passed to the jsPDF instance and html2canvas
   // function. You probably will not need this and things can break, 
   // so use with caution.
   overrides: {
      // see https://artskydj.github.io/jsPDF/docs/jsPDF.html for more options
      pdf: {
         compress: true
      },
      // see https://html2canvas.hertzen.com/configuration for more options
      canvas: {
         useCORS: true
      }
   },
};

// you can use a function to return the target element besides using React refs
const getTargetElement = () => document.getElementById('content-id');

  
  const DeanDataTable = ({ data }) => {

    const targetRef = useRef();

    const [pagination, setPagination] = useState({
      pageIndex: 0,
      pageSize: 10,
    });
    const [exporting, setExporting] = useState(false);

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
      <>
         <div className="flex justify-end m-2">
                <Button variant="secondary" onClick={()=>generatePDF(targetRef, options)}>
                    Export Schedule
                </Button>
            </div>
                <div ref={targetRef}
                className="w-full"         
                style={{
                  position: 'absolute',
                  left: '-9999px',
                  top: '-9999px',
              }} id="content-id">
                    <DeanPdfTemplate data={data} id="content-id"/>
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
  
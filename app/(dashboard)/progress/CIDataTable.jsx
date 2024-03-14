'use client'

import {
    Table,
    TableHead,
    TableHeader,
    TableRow,
    TableBody,
    TableCell
  } from "@/components/ui/table";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2, ScanSearch, MoreVertical } from "lucide-react";
  
import { Button } from "@/components/ui/button";
import { 
useReactTable,
getPaginationRowModel,
getCoreRowModel,
 } from "@tanstack/react-table";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
  
const CIDataTable = ({ data }) => {

    const { toast } = useToast();
    const router = useRouter();


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
  
    const handleApproveCase = async (id) => {
        try {
            const response = await fetch(`/api/progress/case/${id}`,{          
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(id),
          });
          if(response.ok) {
            toast({
                title: "Success",
                description: "Case Approved!",
                status: "success",
              });
          }else {
            toast({
                title: "Uh oh...",
                description: "Failed to approve Case!",
                status: "destructive",
              });
          }
      
        } catch (error) {
            toast({
                title: "Uh oh...",
                description: "Failed to approve Case!",
                status: "destructive",
              });
        }
    };

    const handleViewDetailsRedirect = (id) => {
        router.push(`/progress/case/${id}`, id);
    }
    return (
      <div className="overflow-x-auto rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-center">Case Number</TableHead>
              <TableHead className="text-center">Case Type</TableHead>
              <TableHead className="text-center">Student Name</TableHead>
              <TableHead className="text-center">Level</TableHead>
              <TableHead className="text-center">Date</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.map((Case) => (
              <TableRow key={Case.id}>
                <TableCell className="text-center">{Case.caseNumber}</TableCell>
                <TableCell className="text-center">{Case.caseType}</TableCell>
                <TableCell className="text-center">{Case.user.firstName} {Case.user.lastName}</TableCell>
                <TableCell className="text-center">{Case.level}</TableCell>
                <TableCell className="text-center">{new Date(Case.date).toLocaleDateString()}</TableCell>
                <TableCell className="text-center">{Case.status ? <Badge variant="outline" className="bg-cyan-200 text-blue-500">Approved</Badge> : <Badge variant="outline" className="bg-red-200 text-red-500">Pending</Badge>}</TableCell>
                <TableCell className="items-center">
                    <DropdownMenu>
                    <DropdownMenuTrigger>
                        <MoreVertical className="hover:opacity-70 rounded-full w-10 p-2 h-10  hover:bg-slate-200"/>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56">
                        <DropdownMenuGroup>
                        <DropdownMenuItem onClick={()=>handleApproveCase(Case.id)}>
                            <Pencil className="mr-2 h-4 w-4" />
                            <span>Approve Case</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <Trash2 className="mr-2 h-4 w-4" />
                            <span >Delete Case</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={()=>handleViewDetailsRedirect(Case.id)}>
                            <ScanSearch className="mr-2 h-4 w-4" />
                            <span >View Case Details</span>
                        </DropdownMenuItem>
                        </DropdownMenuGroup>
                    </DropdownMenuContent>
                    </DropdownMenu>

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
  
  export default CIDataTable;
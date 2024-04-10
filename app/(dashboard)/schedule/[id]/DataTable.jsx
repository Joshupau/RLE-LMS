'use client'

import {
    Table,
    TableHead,
    TableHeader,
    TableRow,
    TableBody,
    TableCell,
  } from "@/components/ui/table";
  import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
  import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"

  import { TransferStudent } from "./_components/Transfer-Student";

  import { ScanSearch, MoreVertical } from "lucide-react";

  import { useReactTable, getPaginationRowModel, getCoreRowModel } from "@tanstack/react-table";
  import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";


  const DataTable = ({ data, user, schedules }) => {

    const [transferStatus, setTransferStatus] = useState(null);

    const { toast } = useToast();
    const handleTransferStatusChange = (status) => {
        setTransferStatus(status);
    };

    const [pagination, setPagination] = useState({
      pageIndex: 0,
      pageSize: 30,
    });
    useEffect(() => {
      if (transferStatus === true) {
          toast({
              title: "Success",
              description: `Successfully transfered to another schedule.`,
              status: "Success",
          });
      } else if (transferStatus === false) {
          toast({
              title: "Uh oh...",
              description: `Failed to transfer to another schedule.`,
              status: "Destructive",
              variant: "destructive",
          });
      }
  }, [transferStatus]);
  
  
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

    console.log(data);
  
    return (
      <div className="overflow-x-auto rounded-md border">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-slate-200 bg-slate-200">
              <TableHead className="text-center font-semibold text-black">Students</TableHead>
              <TableHead className="text-center font-semibold text-black">Contact</TableHead> 
              {user.role === "Dean" && (
                  <TableHead className="text-center font-semibold text-black">Actions</TableHead>
                  )}    
            </TableRow>
          </TableHeader>
          <TableBody>
          {paginatedData.map((student) => (
            <TableRow className="h-1" key={student.id}>
              <TableCell className="p-3 text-center">{student.name}</TableCell>
              <TableCell className="p-3 text-center">{student?.contact}</TableCell>
              {user.role === "Dean" && (

                  <TableCell className="p-1 text-center">
              <Dialog className="min-w-max">
                    <DropdownMenu>
                    <DropdownMenuTrigger>
                        <MoreVertical className="hover:opacity-70 rounded-full h-10 w-10 p-2   hover:bg-slate-200"/>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56">
                        <DropdownMenuGroup>
                        <DropdownMenuItem>
                        <DialogTrigger className="flex justify-start">
                            <ScanSearch className="mr-2 h-4 w-4" />
                            <span >Transfer Student</span>
                          </DialogTrigger>
                        </DropdownMenuItem>
                        </DropdownMenuGroup>
                    </DropdownMenuContent>
                    </DropdownMenu>
                    <DialogContent className="min-w-max">
                      <DialogHeader>
                        <DialogTitle>
                            Schedule Transfer
                        </DialogTitle>
                      </DialogHeader>
                      <TransferStudent 
                      schedules={schedules} 
                      data={student}
                      onTransferStatusChange={handleTransferStatusChange} 
                      />
                      </DialogContent>
                      </Dialog>
              </TableCell>
            )}   
            </TableRow>
          ))}
          </TableBody>
        </Table>
      </div>
    );
  };
  
  export default DataTable;
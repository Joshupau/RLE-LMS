'use client'

import {
    Table,
    TableHead,
    TableHeader,
    TableRow,
    TableBody,
    TableCell
} from "@/components/ui/table";

import { Pencil, Trash2, ScanSearch, MoreVertical } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
useReactTable,
getPaginationRowModel,
getCoreRowModel,
 } from "@tanstack/react-table";
import { useState } from "react";
import { EditUser } from "./_components/edit-user";
  
const DataTable = ({ data }) => {
    const [pagination, setPagination] = useState({
      pageIndex: 0, // Initial page index
      pageSize: 7, // Default page size
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
              <TableHead className="text-center text-white">Actions</TableHead>
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
                <TableCell className="text-center">
                <AlertDialog>
                  <Dialog>

                  <DropdownMenu>
                  <DropdownMenuTrigger>
                        <MoreVertical className="hover:opacity-70 rounded-full w-10 p-2 h-10  hover:bg-slate-200"/>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-56">
                          <DropdownMenuGroup>
                              <DropdownMenuItem>
                                <DialogTrigger className="flex w-full">
                                <Pencil className="mr-2 h-4 w-4" />
                                <span>View User Details</span>
                                </DialogTrigger>
                              </DropdownMenuItem>
                              <DropdownMenuItem >
                                  <ScanSearch className="mr-2 h-4 w-4" />
                                  <span >Deactivate User</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                              <AlertDialogTrigger className="flex w-full">
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  <span >Delete User</span>
                              </AlertDialogTrigger>
                              </DropdownMenuItem>
                                </DropdownMenuGroup>
                            </DropdownMenuContent>           
                      </DropdownMenu>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>
                              Edit User
                            </DialogTitle>
                          </DialogHeader>
                          <EditUser user={user}/>
                        </DialogContent>
                    </Dialog>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the schedule
                            and remove the schedule data from our servers. <br /> <br />
                            Note: Once data is present in the resource or cases have been submitted, the schedule cannot be deleted.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction>Continue</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
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
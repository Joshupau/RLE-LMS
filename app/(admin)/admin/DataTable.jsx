'use client'

import {
    Table,
    TableHead,
    TableHeader,
    TableRow,
    TableBody,
    TableCell
} from "@/components/ui/table";

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AddUser } from "./_components/add-user";

import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
useReactTable,
getPaginationRowModel,
getCoreRowModel,
 } from "@tanstack/react-table";
import { EditUser } from "./_components/edit-user";
import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
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
      typeof value === 'string' || typeof value === 'number' ? value.toString().toLowerCase() : ''
    );
    return rowValues.some(value =>
      value.toLowerCase().includes(filterValue.toLowerCase())
    );
  });
};

const DataTable = ({ data }) => {

  const [globalFilter, setGlobalFilter] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([]); 

  const { toast } = useToast();


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

  const handleUserSelect = (userId) => {
    setSelectedUsers(prevSelectedUsers => {
      if (prevSelectedUsers.includes(userId)) {
        return prevSelectedUsers.filter(id => id !== userId); // Deselect user if already selected
      } else {
        return [...prevSelectedUsers, userId]; // Select user if not already selected
      }
    });
  };
  
  const handleSelectAll = (e) => {
    const isChecked = e.target.checked;
    if (isChecked) {
      const allUserIds = paginatedFilteredData.map(row => row.id);
      setSelectedUsers(allUserIds);
    } else {
      setSelectedUsers([]); // Deselect all users if "Select All" is unchecked
    }
  };
  
  const handleDeactivateUsers = async () => {
    try {
      if(!selectedUsers){
       toast({
         title: "Uh oh...",
         description: "No user selected!",
         status: "Failed"
       });
       return
      } 

     const response = await fetch('/api/auth/deactivate-users', {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ ids: selectedUsers })
     });

     if(!response.ok){
      toast({
        title: "Uh oh...",
        description: "Failed to deactivate users!",
        status: "destructive",
        variant: "destructive"
      });
     } else {
      toast({
        title: "Success",
        description: "Successfully deactivated users",
        status: "Success",
        variant: "success"
      });
     }
    } catch (error) {
      toast({
        title: "Uh oh...",
        description: "Failed to deactivate users!",
        status: "destructive",
        variant: "destructive"
      });
    }
  }

  const handleActivateUsers = async () => {
    try {
      if(!selectedUsers){
       toast({
         title: "Uh oh...",
         description: "No user selected!",
         status: "Failed"
       });
       return
      } 

     const response = await fetch('/api/auth/reactivate-users', {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ ids: selectedUsers })
     });

     if(!response.ok){
      toast({
        title: "Uh oh...",
        description: "Failed to Reactivate users!",
        status: "destructive",
        variant: "destructive"
      });
     } else {
      toast({
        title: "Success",
        description: "Successfully Reactivated users",
        status: "Success",
        variant: "success"
      });
     }
    } catch (error) {
      toast({
        title: "Uh oh...",
        description: "Failed to Reactivate users!",
        status: "destructive",
        variant: "destructive"
      });
    }
  }

    return (
      <>
      <div className="flex justify-between">
          <div className="w-1/4 max-w-xs m-2">
            <DebouncedInput value={globalFilter} onChange={setGlobalFilter} />
          </div>
          <div className="flex gap-2">
            <AddUser/>
            <div className="">
            <AlertDialog>
              <AlertDialogTrigger asChild>
              <Button className="bg-blue-500 hover:bg-blue-700">
              Deactivate User/s
            </Button>
            </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action can disrupt users from using the system and will make them
                    unable to login from the site.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDeactivateUsers}>Continue</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            </div>
            <div>
              <Button onClick={handleActivateUsers} className="bg-green-500 hover:bg-green-700">
                Activate User/s
              </Button>
            </div>
          </div>
        </div>
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
              <TableHead className="text-center text-white">Year Level</TableHead>
              <TableHead className="text-center text-white">Actions</TableHead>
              <TableHead className="flex items-center gap-2 text-center text-white">Select All
              <input
                  type="checkbox"
                  checked={
                      paginatedFilteredData.length > 0 &&
                      selectedUsers.length === paginatedFilteredData.length &&
                      paginatedFilteredData.every(row => selectedUsers.includes(row.id))
                  }
                  onChange={handleSelectAll}
              />

              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedFilteredData.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="text-center">{user.schoolId}</TableCell>
                <TableCell className="text-center">{user.firstName} {user?.middleName} {user.lastName}</TableCell>
                <TableCell className="text-center">{user.email}</TableCell>
                <TableCell className="text-center">{user.age}</TableCell>
                <TableCell className="text-center">{user.status ? <Badge variant="outline" className="bg-cyan-200 text-blue-500">Active</Badge> : <Badge variant="outline" className="bg-red-200 text-red-500">Disabled</Badge>}</TableCell>
                <TableCell className="text-center">{user.role}</TableCell>
                <TableCell className="text-center">{user?.yearLevel}</TableCell>             
                <TableCell className="text-center">
                <AlertDialog>
                  <Dialog>
                    <DialogTrigger>
                      <Button>
                        Edit User
                      </Button>
                    </DialogTrigger>
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
                            This action cannot be undone. This will permanently delete the user data from our servers. <br /> <br />
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction>Continue</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                </TableCell>
                <TableCell className="text-center">
                <input
                      type="checkbox"
                      checked={selectedUsers.includes(user.id)}
                      onChange={() => handleUserSelect(user.id)}
                  />
                 
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
      </>
    );
  };
  
  export default DataTable;
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
 import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
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
      value.toLowerCase().includes(filterValue.toLowerCase()) || 
      row.user.firstName.toLowerCase().includes(filterValue.toLowerCase()) || 
      row.user.lastName.toLowerCase().includes(filterValue.toLowerCase())
    );
  });
};


const CIDataTable = ({ data }) => {

  const [globalFilter, setGlobalFilter] = useState('');


    const { toast } = useToast();
    const router = useRouter();


    const [pagination, setPagination] = useState({
      pageIndex: 0, // Initial page index
      pageSize: 5, // Default page size
    });

    useEffect(() => {
      if (globalFilter === null) {
        setGlobalFilter('');
      }
    }, [globalFilter]);
  
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
  
    const handleApproveCase = async (id) => {
        try {
          const response = await fetch(`/api/progress/case/${id}/approve`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id }), 
        });
          if(response.ok) {
              toast({
                  title: "Success",
                  description: "Case Approved",
                  status: "success",
                });
          }else {
            toast({
                title: "Uh oh...",
                description: "Failed to approve Case.",
                status: "destructive",
              });
          }
      
        } catch (error) {
          toast({
            title: "Uh oh...",
            description: "Failed to approve Case.",
            status: "destructive",
          });
        }
    };
    const handleDisapproveCase = async (id) => {
      try {
        const response = await fetch(`/api/progress/case/${id}/disapprove`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id }), 
      });
        if(response.ok) {
            toast({
              title: "Success",
              description: "Case Disapproved.",
              status: "success",
            });
        }else {
          toast({
            title: "Uh oh...",
            description: "Failed to disapprove case.",
            status: "destructive",
          });
        }
    
      } catch (error) {
        toast({
          title: "Uh oh...",
          description: "Failed to disapprove case.",
          status: "destructive",
        });
      }
  };

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
              <TableHead className="text-center">Student Name</TableHead>
              <TableHead className="text-center">Case Type</TableHead>
              <TableHead className="text-center">Level</TableHead>
              <TableHead className="text-center">Date</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedFilteredData.map((Case) => (
              <TableRow key={Case.id}>
                <TableCell className="text-center">{Case.caseNumber}</TableCell>
                <TableCell className="text-center">{`${Case.user.firstName} ${Case.user.lastName}`}</TableCell>
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
                <TableCell className="items-center">
                <Dialog className="min-w-max">
                    <DropdownMenu>
                    <DropdownMenuTrigger>
                        <MoreVertical className="hover:opacity-70 rounded-full w-10 p-2 h-10  hover:bg-slate-200"/>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56">
                        <DropdownMenuGroup>
                        <DropdownMenuItem>
                        <DialogTrigger className="flex justify-start">
                            <ScanSearch className="mr-2 h-4 w-4" />
                            <span >View Case Details</span>
                          </DialogTrigger>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleApproveCase(Case.id)}>
                            <Pencil className="mr-2 h-4 w-4" />
                            <span>Approve Case</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDisapproveCase(Case.id)}>
                            <Trash2 className="mr-2 h-4 w-4" />
                            <span >Disapprove Case</span>
                        </DropdownMenuItem>
                        </DropdownMenuGroup>
                    </DropdownMenuContent>
                    </DropdownMenu>
                    <DialogContent className="min-w-max">
                      <DialogHeader>
                        <DialogTitle>
                            Case Details
                        </DialogTitle>
                      </DialogHeader>
                      {Case.drCordCase.length !== 0 && (
                          <>
                            <Table>
                            <TableHeader>
                              <TableRow>
                              <TableHead className="text-center">Baby Name</TableHead>
                              <TableHead className="text-center">Sex</TableHead>
                              <TableHead className="text-center">APGAR Score</TableHead>
                              <TableHead className="text-center">Name of Mother</TableHead>
                              <TableHead className="text-center">Age of Mother</TableHead>
                              <TableHead className="text-center">Staff on Duty</TableHead>
                              <TableHead className="text-center">Hospital/Agency</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {Case.drCordCase.map((drc)=>(
                                <TableRow key={drc.id}>
                                <TableCell className="text-center">{drc.babyName}</TableCell>
                                <TableCell className="text-center">{drc.sex}</TableCell>
                                <TableCell className="text-center">{drc.apgarScore}</TableCell>
                                <TableCell className="text-center">{drc.motherName}</TableCell>
                                <TableCell className="text-center">{drc.motherAge}</TableCell>
                                <TableCell className="text-center">{drc.staff}</TableCell>
                                <TableCell className="text-center">{drc.birthplace}</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                          </>
                      )}
                      {Case.drMACase.length !== 0 && (
                          <>
                          <Table>
                            <TableHeader>
                              <TableRow>
                              <TableHead className="text-center">Patient Name</TableHead>
                              <TableHead className="text-center">Age</TableHead>
                              <TableHead className="text-center">Medical Diagnosis</TableHead>
                              <TableHead className="text-center">Date of Delivery</TableHead>
                              <TableHead className="text-center">Time of Delivery</TableHead>
                              <TableHead className="text-center">Type of Delivery</TableHead>
                              <TableHead className="text-center">Hospital/Agency</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {Case.drMACase.map((drMA)=>(
                                <TableRow key={drMA.id}>
                                <TableCell className="text-center">{drMA.patientName}</TableCell>
                                <TableCell className="text-center">{drMA.age}</TableCell>
                                <TableCell className="text-center">{drMA.medicalDiagnosis}</TableCell>
                                <TableCell className="text-center">{new Date(drMA.dateOfDelivery).toLocaleDateString()}</TableCell>
                                <TableCell className="text-center">{new Date(drMA.timeOfDelivery).toLocaleTimeString("en-US", { timeZone: "UTC" })}</TableCell>
                                <TableCell className="text-center">{drMA.typeOfDelivery}</TableCell>
                                <TableCell className="text-center">{drMA.birthplace}</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                          </>
                      )}
                      {Case.orMajorMinorCase.length !== 0 && (
                          <>
                          <Table>
                            <TableHeader>
                              <TableRow>
                              <TableHead className="text-center">Patient Name</TableHead>
                              <TableHead className="text-center">Age</TableHead>
                              <TableHead className="text-center">Sex</TableHead>
                              <TableHead className="text-center">Medical Diagnosis</TableHead>
                              <TableHead className="text-center">Operation</TableHead>
                              <TableHead className="text-center">Surgeon</TableHead>
                              <TableHead className="text-center">Type of Anesthesia</TableHead>
                              <TableHead className="text-center">Anesthesiologist</TableHead>
                              <TableHead className="text-center">Scrub/Circulating Nurse</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {Case.orMajorMinorCase.map((or)=>(
                                <TableRow key={or.id}>
                                <TableCell className="text-center">{or.patientName}</TableCell>
                                <TableCell className="text-center">{or.age}</TableCell>
                                <TableCell className="text-center">{or.sex}</TableCell>
                                <TableCell className="text-center">{or.medicalDiagnosis}</TableCell>
                                <TableCell className="text-center">{or.operation}</TableCell>
                                <TableCell className="text-center">
                                {Array.isArray(or.surgeon) ? (
                                      or.surgeon.map((surgeon, index) => (
                                          <span key={index}>
                                              {surgeon}
                                              {index !== or.surgeon.length - 1 && <br />}
                                          </span>
                                      ))
                                  ) : (
                                      or.surgeon
                                  )}
                                </TableCell>
                                <TableCell className="text-center">{or.typeOfAnesthesia}</TableCell>
                                <TableCell className="text-center">{or.anesthesiologist}</TableCell>
                                <TableCell className="text-center">{or.scrub}</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                          </>
                      )}
                      {Case.chnCase.length !== 0 && (
                          <>
                            <Table>
                            <TableHeader>
                              <TableRow>
                              <TableHead className="text-center">Name of Family Members</TableHead>
                              <TableHead className="text-center">Relation to Head</TableHead>
                              <TableHead className="text-center">Birthday</TableHead>
                              <TableHead className="text-center">Sex</TableHead>
                              <TableHead className="text-center">Marital Status</TableHead>
                              <TableHead className="text-center">Highest Educational Attainment</TableHead>
                              <TableHead className="text-center">Occupation</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                                {Case.chnCase.map((chn) => {
                                    const maxLength = Math.max(
                                        chn.nameOfFamilyMembers.length,
                                        chn.relationToHead.length,
                                        chn.birthday.length,
                                        chn.sex.length,
                                        chn.maritalStatus.length,
                                        chn.educationalAttainment.length,
                                        chn.occupation.length
                                    );

                                    return Array.from({ length: maxLength }, (_, index) => (
                                        <TableRow key={index}>
                                            <TableCell className="text-center">{chn.nameOfFamilyMembers[index]}</TableCell>
                                            <TableCell className="text-center">{chn.relationToHead[index]}</TableCell>
                                            <TableCell className="text-center">{new Date(chn.birthday[index]).toLocaleDateString()}</TableCell>
                                            <TableCell className="text-center">{chn.sex[index]}</TableCell>
                                            <TableCell className="text-center">{chn.maritalStatus[index]}</TableCell>
                                            <TableCell className="text-center">{chn.educationalAttainment[index]}</TableCell>
                                            <TableCell className="text-center">{chn.occupation[index]}</TableCell>
                                        </TableRow>
                                    ));
                                })}
                            </TableBody>
                          </Table>
                          </>
                      )}
                      {Case.medicalCase.length !== 0 && (
                          <>
                          <Table>
                            <TableHeader>
                              <TableRow>
                              <TableHead className="text-center">Patient Name</TableHead>
                              <TableHead className="text-center">Age</TableHead>
                              <TableHead className="text-center">Marital Status</TableHead>
                              <TableHead className="text-center">Sex</TableHead>
                              <TableHead className="text-center">Attending Physician</TableHead>
                              <TableHead className="text-center">Medical Diagnosis</TableHead>
                              <TableHead className="text-center">Date Admitted</TableHead>
                              <TableHead className="text-center">Date Discharged</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {Case.medicalCase.map((medical)=>(
                                <TableRow key={medical.id}>
                                <TableCell className="text-center">{medical.patientName}</TableCell>
                                <TableCell className="text-center">{medical.age}</TableCell>
                                <TableCell className="text-center">{medical.maritalStatus}</TableCell>
                                <TableCell className="text-center">{medical.sex}</TableCell>
                                <TableCell className="text-center">{medical.attendingPhysician}</TableCell>
                                <TableCell className="text-center">{medical.medicalDiagnosis}</TableCell>
                                <TableCell className="text-center">{new Date(medical.dateAdmitted).toLocaleDateString()}</TableCell>
                                <TableCell className="text-center">{new Date(medical.dateDischarge).toLocaleDateString()}</TableCell> 
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                          </>
                      )}
                    </DialogContent>
                  </Dialog>
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
  
  export default CIDataTable;
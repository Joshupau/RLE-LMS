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
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { Label } from "@/components/ui/label";

import { Card } from "@/components/ui/card";

export const CaseTrends = ({ yearLevelTables }) => {
  const [selectedYear, setSelectedYear] = useState(Object.keys(yearLevelTables)[0]);

  const groupColors = {
    A: "bg-green-500",
    B: "bg-blue-500",
  };

  const handleYearChange = (selectedYear) => {
    setSelectedYear(selectedYear);
  };

  return (
    <Card>
      <div className="flex p-3 items-center justify-start w-1/2 mt-2">
        <Label className="text-bold text-lg mr-4">Year:</Label>
        <Select onValueChange={handleYearChange} value={selectedYear} id="year">
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select Year" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {Object.keys(yearLevelTables).map((year) => (
                <SelectItem key={year} value={year}>
                  Year {year}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Table className="w-full mt-4">
          <TableHeader>
            <TableRow>
              <TableHead>Case Type</TableHead>
              <TableHead>Group A (%)</TableHead>
              <TableHead>Group B (%)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Object.entries(yearLevelTables[selectedYear]).map(([caseType, percentages]) => (
              <TableRow key={caseType} className="border-b p-1">
                <TableCell>{caseType}</TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <div className={`w-${percentages.percentageA}/12 h-4 rounded-full ${groupColors["A"]}`}></div>
                    <span className="ml-2">{percentages.percentageA}%</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <div className={`w-${percentages.percentageB}/12 h-4 rounded-full ${groupColors["B"]}`}></div>
                    <span className="ml-2">{percentages.percentageB}%</span>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
};

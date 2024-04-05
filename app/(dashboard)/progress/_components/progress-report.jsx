'use client'

import { useEffect, useState } from 'react';
import { Card } from "@/components/ui/card";
import PR2DataTable from './pr-2-datatable';
import PR3DataTable from './pr-3-datatable';
import PR4DataTable from './pr-4-datatable';

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select";

export const ProgressReport = ({ data }) => {
    const [yearLevelFilter, setYearLevelFilter] = useState(null);
    const [groupFilter, setGroupFilter] = useState(null);
    const [filteredData, setFilteredData] = useState([]);
    useEffect(() => {
        if (data && typeof data === 'object') {
            // Flatten the data object into a single array of students
            const allStudents = Object.values(data).flat();

            // Filter data by year level
            let filteredByYearLevel = allStudents;
            if (yearLevelFilter) {
                filteredByYearLevel = allStudents.filter(student => student.yearLevel === yearLevelFilter);
            }

            // Apply group filter if set
            if (groupFilter) {
                filteredByYearLevel = filteredByYearLevel.filter(student => student.group === groupFilter);
            }

            // Update filteredData state
            setFilteredData(filteredByYearLevel);
        }
    }, [data, yearLevelFilter, groupFilter]);


        return (
        <Card>
            <div className="flex justify-end">

            <div>
                Year level Filter:
                <Select onValueChange={(e) => setYearLevelFilter(parseInt(e))}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select Year"/>
                    </SelectTrigger>
                    <SelectContent> 
                    <SelectGroup> 
                        <SelectItem value="2">2</SelectItem>
                        <SelectItem value="3">3</SelectItem>
                        <SelectItem value="4">4</SelectItem>
                    </SelectGroup>
                    </SelectContent>
                </Select>
            </div>
            <div>
                Group Filter:
                <Select onValueChange={(e) => setGroupFilter(e)}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select Group"/>
                    </SelectTrigger>
                    <SelectContent> 
                    <SelectGroup> 
                        <SelectItem value="A">A</SelectItem>
                        <SelectItem value="B">B</SelectItem>
                    </SelectGroup>
                    </SelectContent>
                </Select>
            </div>
            </div>
            <div>
            {yearLevelFilter === 2 && <PR2DataTable data={filteredData} />}
                {yearLevelFilter === 3 && <PR3DataTable data={filteredData} />}
                {yearLevelFilter === 4 && <PR4DataTable data={filteredData} />}
            </div>
        </Card>
    );
};

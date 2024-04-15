'use client'
import { useEffect, useState } from 'react';
import { ResponsiveBar } from '@nivo/bar';
import { Card } from '@/components/ui/card';
import { Status } from '@prisma/client';

export const StudentCaseProgress = ({data}) => {
    const [chartData, setChartData] = useState([]);
    const [yMarkers, setYMarkers] = useState([]);

    useEffect(() => {
        const goals = {
          "Medical": 15,
          "Pediatrics": 20,
          "Communicable Diseases": 25,
          "Obstetrics": 20,
          "Surgical": 20,
          "Medical Surgical Intensive": 10,
          "Orthopedics": 10,
          "Gynecology": 13,
          "EENT": 10,
          "Nursery": 6,
          "Psychiatric": 10,
          "OR Major": 10,
          "OR Minor": 7,
          "DR Manage": 7,
          "DR Assist": 7,
          "DR Cord Care": 7,
          "CHN": 35
        };
    
        const casesCount = {};
        const approvedCount = {};
        const pendingCount = {};
        data.forEach((caseData) => {
          if (!casesCount[caseData.caseType]) {
            casesCount[caseData.caseType] = 0;
            approvedCount[caseData.caseType] = 0;
            pendingCount[caseData.caseType] = 0;
          }
          casesCount[caseData.caseType]++;
          if (caseData.statusMigrate === Status.APPROVED) {
            approvedCount[caseData.caseType]++;
          } else {
            pendingCount[caseData.caseType]++;
          }
        });
    
        const chartData = Object.keys(casesCount).map((caseType) => ({
          caseType,
          "Pending Cases": pendingCount[caseType],
          "Approved Cases": approvedCount[caseType],
          Goal: goals[caseType]
        }));
    
        setChartData(chartData);
      }, [data]);

    return(
        <>
        <Card style={{ height: '400px' }}>
      <ResponsiveBar
        data={chartData}
        keys={['Pending Cases', 'Approved Cases', 'Goal']}
        indexBy="caseType"
        margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
        padding={0.3}
        layout="vertical"
        colors={['#3B82F6', '#22C55E', '#FF6347']}
        borderColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
        axisTop={null}
        axisRight={null}
        axisBottom={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: 'Case Type',
          legendPosition: 'middle',
          legendOffset: 32
        }}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: 'Goal',
          legendPosition: 'middle',
          legendOffset: -40
        }}
        labelSkipWidth={12}
        labelSkipHeight={12}
        labelTextColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
        legends={[
          {
            dataFrom: 'keys',
            anchor: 'bottom-right',
            direction: 'column',
            justify: false,
            translateX: 120,
            translateY: 0,
            itemsSpacing: 2,
            itemWidth: 100,
            itemHeight: 20,
            itemDirection: 'left-to-right',
            itemTextColor: '#000',
            symbolSize: 20,
            effects: [
              {
                on: 'hover',
                style: {
                  itemTextColor: '#000'
                }
              }
            ]
          }
        ]}
        animate={true}
        motionStiffness={90}
        motionDamping={15}
      />
    </Card>
        </>
    )
}
'use client'

import { ResponsiveLine } from "@nivo/line";
import { Card } from "@/components/ui/card";

export const AttendanceAnalytics = ({ data }) => {
    const formattedData = [
        {
            id: 'Present',
            data: data.map((item) => ({
                x: item.x,
                y: item.y,
            })),
        },
        {
            id: 'Absences',
            data: data.map((item) => ({
                x: item.x,
                y: item.y2,
            })),
        },
        {
            id: 'Students Scheduled',
            data: data.map((item) => ({
                x: item.x,
                y: item.y3,
            })),
        },
    ];


    return (
        <>
        <Card style={{ height: '400px' }}>
            <ResponsiveLine
                data={formattedData}
                margin={{ top: 10, right: 10, bottom: 60, left: 40 }}
                xScale={{ type: "point" }}
                yScale={{ type: "linear", min: 0, max: "auto" }}
                axisBottom={{ tickSize: 0, tickPadding: 16 }}
                axisLeft={{ tickSize: 0, tickValues: 5, tickPadding: 16 }}
                colors={["#2563eb", "#e11d48", "#6fcf97"]} // Add a color for the TotalSchedules line
                pointSize={6}
                useMesh={true}
                curve="monotoneX"
                enableArea={true}
                gridYValues={6}
                legends={[
                    {
                        anchor: 'bottom',
                        direction: 'row',
                        translateY: 40,
                        itemWidth: 180,
                        itemHeight: 0,
                        symbolSize: 15,
                        symbolShape: 'circle',
                        textColor: '#333',
                        symbolBorderColor: 'rgba(0, 0, 0, .5)',
                    },
                ]}
            />
        </Card>
    </>
    );
};

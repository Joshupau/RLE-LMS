'use client'

import { ResponsiveLine } from '@nivo/line';
import { Card } from '@/components/ui/card';

export const LinePlot = ({ data }) => {

    return (
        <Card style={{ width: '45%', height: '400px' }}>
        <ResponsiveLine
            data={data}
            margin={{ top: 10, right: 10, bottom: 40, left: 40 }}
            xScale={{
                type: "point",
            }}
            yScale={{
                type: "linear",
                min: 0,
                max: "auto",
            }}
            axisTop={null}
            axisRight={null}
            axisBottom={{
                tickSize: 0,
                tickPadding: 16,
            }}
            axisLeft={{
                tickSize: 0,
                tickValues: 5,
                tickPadding: 16,
            }}
            colors={["#2563eb", "#e11d48"]}
            pointSize={6}
            useMesh={true}
            curve="monotoneX"
            enableArea={true}
            gridYValues={6}
            defs={[
                {
                    id: "line-chart-gradient",
                    type: "linearGradient",
                    colors: [
                        { offset: 0, color: "inherit" },
                        { offset: 200, color: "inherit", opacity: 0 },
                    ],
                },
            ]}
            fill={[{ match: "*", id: "line-chart-gradient" }]}
            theme={{
                tooltip: {
                    chip: {
                        borderRadius: "9999px",
                    },
                    container: {
                        fontSize: "12px",
                        textTransform: "capitalize",
                        borderRadius: "6px",
                    },
                },
                grid: {
                    line: {
                        stroke: "#f3f4f6",
                    },
                },
            }}
            legends={[
                {
                    anchor: 'bottom',
                    direction: 'row',
                    justify: false,
                    translateX: 0,
                    translateY: 40,
                    itemsSpacing: 40,
                    itemWidth: 100,
                    itemHeight: 20,
                    itemDirection: 'left-to-right',
                    itemOpacity: 0.85,
                    symbolSize: 20,
                    effects: [
                        {
                            on: 'hover',
                            style: {
                                itemOpacity: 1
                            }
                        }
                    ]
                }
            ]}
        />
    </Card>
    );
};


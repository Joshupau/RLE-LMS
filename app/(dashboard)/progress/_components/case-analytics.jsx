'use client'

import { ResponsiveBar, ResponsiveLine } from "@nivo/bar";
import { Card } from "@/components/ui/card";

export const CasePerformanceAnalytics = ({ visualizations }) => {
    return (
        <>
            {visualizations.map((visualization, index) => {
                            <>
                        <Card key={index} style={{ height: '400px' }}>
                            <ResponsiveBar
                                data={visualization.data}
                                keys={['Group A', 'Group B']}
                                indexBy="level"
                                margin={{ top: 10, right: 10, bottom: 40, left: 40 }}
                                padding={0.3}
                                colors={{ scheme: 'category10' }}
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
                                enableGridX={false}
                                enableGridY={true}
                                labelSkipWidth={12}
                                labelSkipHeight={12}
                                labelTextColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
                                animate={true}
                                motionStiffness={90}
                                motionDamping={15}
                                />
                        </Card>
                    <Card key={index} style={{ height: '400px' }}>
                            <ResponsiveLine
                                data={visualization.data}
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
                                />
                        </Card>
          
            </>
            })}
        </>
    );
};

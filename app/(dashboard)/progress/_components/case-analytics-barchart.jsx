'use client'

import { ResponsiveBar } from '@nivo/bar';
import { Card } from '@/components/ui/card';

export const BarChart = ({ data }) => {
    return (
        <Card className="h-[400px] m-2">
        <ResponsiveBar
            data={data}
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
            legends={[
                {
                    dataFrom: 'keys',
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


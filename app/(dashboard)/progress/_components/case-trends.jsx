import {
    Table,
    TableHead,
    TableHeader,
    TableRow,
    TableBody,
    TableCell
} from "@/components/ui/table";


export const CaseTrends = ({yearLevelTables}) => {
    const groupColors = {
        A: 'bg-green-500',
        B: 'bg-blue-500',
      };
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
        {Object.keys(yearLevelTables).map((year) => (
          <div key={year}>
            <h2 className="text-xl font-bold">Year {year}</h2>
            <Table className="w-full mt-4">
              <TableHeader>
                <TableRow>
                  <TableHead>Case Type</TableHead>
                  <TableHead>Group A (%)</TableHead>
                  <TableHead>Group B (%)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Object.entries(yearLevelTables[year]).map(([caseType, percentages]) => (
                  <TableRow key={caseType} className="border-b">
                    <TableCell>{caseType}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <div className={`w-${percentages.percentageA}/12 h-4 rounded-full ${groupColors['A']}`}></div>
                        <span className="ml-2">{percentages.percentageA}%</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <div className={`w-${percentages.percentageB}/12 h-4 rounded-full ${groupColors['B']}`}></div>
                        <span className="ml-2">{percentages.percentageB}%</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ))}
      </div>
    )
}
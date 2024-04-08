import { 
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  } from "@/components/ui/card";
  import { UserIcon,  CheckIcon } from "lucide-react";

export const StudentPerformanceCards = ({cases, absences}) => {
    return (
        <>
        <Card className="flex-1 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Cases Submitted</CardTitle>
              <UserIcon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{cases.length}/250</div>
            </CardContent>
          </Card>
          <Card className="flex-1 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Total Absences</CardTitle>
              <UserIcon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{absences.absences}</div>
            </CardContent>
          </Card>
          <Card className="flex-1 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Case Progress</CardTitle>
              <CheckIcon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{(cases.length / 250) * 100}%</div>
            </CardContent>
        </Card>
          </>
    )
}


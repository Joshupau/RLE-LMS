import { getCase } from "@/actions/get-case";

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
  

export default async function casePage({params}){

    const patientCase = await getCase(params.id);
return(
    <>
 <div className="p-6">    
                <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-y-2">
                    <h1 className="text-2xl font-medium">RLE Performance</h1>
                    <span className="text-sm text-slate-700">Submit and view your RLE cases</span>
                    </div>
                </div>
                <div className="flex flex-col items-center justify-center mt-20">
                    <div className="align-center items-center justify-center">
                        <Card>
                            <CardHeader>
                                <CardTitle>Case Details</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p>
                                    {patientCase.level}
                                </p>
                            </CardContent>
                        </Card>
                     </div>
             </div>
        </div>
                 </>
)
}
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"




export default async function welcomepage(){
    return (
            <Card className="w-1/2 flex items-center border:hidden">
                <CardHeader>
                    <CardTitle>
                        Welcome to RLE-LMS
                    </CardTitle>
                </CardHeader>
                <CardTitle>
                    <Link href="/dashboard">
                        Go to Dashboard
                    </Link>
                </CardTitle>

            </Card>
            
    )
}
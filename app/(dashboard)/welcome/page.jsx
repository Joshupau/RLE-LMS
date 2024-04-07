import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"




export default function welcomepage(){
    return (
            <Card className="w-full flex items-center justify-center h-[300px] border:hidden">
                <div>
                <CardHeader>
                    <CardTitle className="text-2xl">
                        Welcome to RLE-LMS
                    </CardTitle>
                </CardHeader>
                </div>
                <div>
                <CardTitle className="text-md">
                    <Button>
                    <Link href="/dashboard">
                        Go to Dashboard
                    </Link>
                    </Button>
                </CardTitle>
                </div>

            </Card>
            
    )
}
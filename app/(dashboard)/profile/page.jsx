import Link from "next/link"
import { Button } from "@/components/ui/button"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { BasicInfo } from "./_components/basic-info"
import { getUserData } from "@/actions/get-user-data"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { ChangePassword } from "./_components/change-password"

export default async function ProfilePage() {
    const session = await getServerSession(authOptions);
    const data = await getUserData(session?.token.id);

    return (
        <div className="p-6">    
            <div className="flex items-center justify-between">
                <div className="flex flex-col gap-y-2">
                    <h1 className="text-2xl font-medium">Personal Information</h1>
                    <span className="text-sm text-slate-700">Update your basic information</span>
                </div>

            </div>
            <Card className="w-1/2">
                <CardContent>
            <Tabs defaultValue="account">
                <TabsList>
                    <TabsTrigger value="account">Basic Info</TabsTrigger>
                    <TabsTrigger value="password">Change Password</TabsTrigger>
                </TabsList>
                    <TabsContent value="account">
                        <BasicInfo data={data}/>
                    </TabsContent>
                    <TabsContent value="password">
                        <ChangePassword data={data}/>
                    </TabsContent>
            </Tabs>
                </CardContent>
            </Card>
        </div>
    )
}

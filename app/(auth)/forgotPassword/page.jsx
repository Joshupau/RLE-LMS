import { Card, CardContent } from "@/components/ui/card";

export const ForgotPasswordPage = () => {
    return (
        <div className="flex justify-center items-center h-screen">
            <Card>
                <CardContent className="flex justify-center items-center">
                    <h1 className="mt-2 font-bold text-2xl">
                        Please Contact the System Administrator of NurseSync. 
                    </h1>
                </CardContent>
            </Card>
        </div>
    );
};

export default ForgotPasswordPage;

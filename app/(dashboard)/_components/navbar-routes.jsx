"use client";

import { LogOut, User } from "lucide-react";
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from "next/navigation";

export const NavbarRoutes = () => {
    const { data: session, status } = useSession();
    const router = useRouter();

    if (status === "loading") {
        return <p>Loading...</p>;
      }
    if(!session){
        router.push("/");
        router.refresh();
    }

    const handleSignOut = async () => {
        await signOut({ redirect: false });
        router.push("/");
    };

    return (
        <div className="flex items-center gap-x-2 ml-auto">
            {session && (
                <p className="flex items-center mr-4">
                    <User className="mr-2" />
                    Welcome back {session.token.firstName.toUpperCase()} {session.token.lastName.toUpperCase()}
                </p>
            )}
            
            <button onClick={handleSignOut} className="flex hover:bg-slate-200 transition  p-2 rounded-full">
            <LogOut className="h-6 w-6 mr-2"/>
                Signout
            </button>
        </div>
    );
};

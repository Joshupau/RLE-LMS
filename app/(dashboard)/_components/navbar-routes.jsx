"use client";

import { LogOut, User } from "lucide-react";
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
  

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
                <>
                    <DropdownMenu>
                    <DropdownMenuTrigger>
                    <User
                    size={30}     
                    className="border-2 border-black hover:border-slate-700 hover:bg-slate-200 rounded-full m-2" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                            <Link href="/profile">
                            Profile
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                        <LogOut className="mr-2 h-4 w-4" />
                        <span onClick={handleSignOut}>Log out</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                    </DropdownMenu>
                <p className="mr-4">
                    Welcome back {session.token.firstName.toUpperCase()} {session.token.lastName.toUpperCase()}
                </p>
                </>
            )}
            
            <button onClick={handleSignOut} className="flex hover:bg-slate-200 transition  p-2 rounded-full">
            <LogOut className="h-6 w-6 mr-2"/>
                Signout
            </button>
        </div>
    );
};

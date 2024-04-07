"use client";

import { LogOut, User, Bell } from "lucide-react";
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState, useEffect } from "react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
  import {
    Popover,
    PopoverContent,
    PopoverTrigger,
  } from "@/components/ui/popover"

import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export const NavbarRoutes = ({firstName, lastName, notifications}) => {
    const router = useRouter();

    const [notification, setNotification] = useState(notifications);
    const [unreadCount, setUnreadCount] = useState(0);


    const handleSignOut = async () => {
        await signOut({ redirect: false });
        router.push("/");
    };


    useEffect(() => {
      // Calculate the number of unread notifications
      const unread = notification.filter(notification => !notification.isRead).length;
      setUnreadCount(unread);
    }, [notifications]);

    const handleReadTrue = async (notification) => {
        try {

            const response = await fetch(`/api/notification`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ notification, status: true }), 
            });

            if(!response.ok){
                console.warn("Failed to make notifications read");
            }
            setUnreadCount(0);

        } catch (error) {
            console.warn("Failed to make notifications read", error);
        }
    }

    return (
        <div className="flex items-center z-50 gap-x-2 ml-auto">
                <Popover>
                <PopoverTrigger onClick={()=>handleReadTrue(notification)}>
                    <div className="relative">
                    <Bell size={30} className="w-6 h-6 ml-4" />
                    {unreadCount > 0 && (
                        <Badge 
                        variant="outline"
                        className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 text-xs bg-red-500"
                        >
                        {unreadCount}
                        </Badge>
                    )}
                    </div>
                </PopoverTrigger>
                <PopoverContent className="bg-white">
                    <div className="flex flex-col space-y-2">
                    {notification.map(notification => (
                        <a href={notification.link} key={notification.id} className="block hover:bg-gray-100 p-2 rounded-md">
                        <h3 className="text-lg font-semibold">{notification.title}</h3>
                        <p className="text-sm">{notification.message}</p>
                        <p className="text-xs text-gray-500">Received at: {new Date(notification.createdAt).toLocaleString()}</p>
                        <Separator className="mt-5"/>
                        </a>
                    ))}
                    {notification.length === 0 && <p>No notifications</p>}
                    </div>
                </PopoverContent>
                </Popover>
                    <DropdownMenu>
                    <DropdownMenuTrigger>
                    <User
                    size={30}     
                    className="m-2" />
                    
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
                    Welcome, {firstName.toUpperCase()}!
                </p>
        </div>
    );
};

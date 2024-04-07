"use client"

import { Layout, Compass, List, BarChart } from "lucide-react";
import { SidebarItem } from "./sidebar-item";
import { usePathname } from "next/navigation";

const guestRoutes = [
    {
        icon: Layout,
        label: "Dashboard",
        href: "/dashboard",
    },
    {
        icon: Compass,
        label: "Schedule",
        href: "/schedule",
    },
    {
        icon: List,
        label: "Resources",
        href: "/resources",
    },
    {
        icon: BarChart,
        label: "Progress",
        href: "/progress"
    },
    {
        icon: BarChart,
        label: "rledashboard",
        href: "/rledashboard"
    }


];

const teacherRoutes = [
    {
        icon: List,
        label: "Courses",
        href: "/teacher/courses",
    },
    {
        icon: BarChart,
        label: "Analytics",
        href: "/teacher/analytics",
    }


];

export const SidebarRoutes = () => {
    const pathname = usePathname();

    const isTeacherPage = pathname?.includes("/teacher");


    const routes = isTeacherPage ? teacherRoutes : guestRoutes;


    return(
        <div className="flex flex-col w-full">
            {routes.map((route) => (
            <SidebarItem
            key={route.href}
            icon ={route.icon}
            label={route.label}
            href={route.href}
            />
            ))}
        </div>
    )
}
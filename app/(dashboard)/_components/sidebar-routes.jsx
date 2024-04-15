'use client'

import { Layout, Compass, List, BarChart } from "lucide-react";
import { SidebarItem } from "./sidebar-item";

const studentRoutes = [
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
        href: "/progress/student"
    }];

const instructorRoutes = [
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
        href: "/progress/ci"
    }
];

const deanRoutes = [
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
        icon: BarChart,
        label: "Progress",
        href: "/progress"
    }];

    
const adminRoute = [
    {
        icon: Layout,
        label: "Dashboard",
        href: "/admin",
    },

    {
        icon: BarChart,
        label: "Activity Log",
        href: "/alog"
    }];

export const SidebarRoutes = ({ session }) => {
    const userRole = session?.token?.role;
    
    let routes;

    switch (userRole) {
        case 'Student':
            routes = studentRoutes;
            break;
        case 'ClinicalInstructor':
            routes = instructorRoutes;
            break;
        case 'Dean':
            routes = deanRoutes;
            break;
        case 'SystemAdmin':
            routes = adminRoute;
            break;           
    }

    return (
        <div className="flex flex-col w-full">
            {routes.map((route) => (
                <SidebarItem
                    key={route.href}
                    icon={route.icon}
                    label={route.label}
                    href={route.href}
                />
            ))}
        </div>
    );
};

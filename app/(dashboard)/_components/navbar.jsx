import { MobileSidebar } from "./mobile-sidebar";
import { NavbarRoutes } from "./navbar-routes";


import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getNotification } from "@/actions/get-notification";

export const Navbar = async () => {
    const data = await getServerSession(authOptions);
    
    const notification = await getNotification(data.token.id);
    

    return (
        <div className="position-fixed top-0 left-0 right-0 z-10 p-4 border-b h-full flex items-center bg-white shadow-sm ">
        <MobileSidebar/>
        <NavbarRoutes notifications={notification} firstName={data.token.firstName} lastName={data.token.lastName}/>
        </div>
        )
}
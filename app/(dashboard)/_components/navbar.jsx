import { MobileSidebar } from "./mobile-sidebar"
import { NavbarRoutes } from "./navbar-routes"

export const Navbar = () => {
    return (
        <div className="position-fixed top-0 left-0 right-0 z-10 p-4 border-b h-full flex items-center bg-white shadow-sm ">
        <MobileSidebar/>
        <NavbarRoutes/>
        </div>
        )
}
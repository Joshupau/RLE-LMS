import Image from "next/image";

export const Logo = () => {
    return ( 
        <Image
        height={100}
        width={100}
        alt="logo"
        src="/logo.png"
        priority={true} 
        className="w-auto h-auto"
        />
     );
}
 
export default Logo;
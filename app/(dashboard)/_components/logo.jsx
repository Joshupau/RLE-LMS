import Image from "next/image";
import Link from 'next/link'

export const Logo = () => {
    return ( 
        <>
        <Link href='/dashboard'>
        <Image
        height={100}
        width={100}
        alt="logo"
        src="/logo.png"
        priority={true} 
        className="w-auto h-auto"
        />
        </Link>
        </>
     );
}
 
export default Logo;
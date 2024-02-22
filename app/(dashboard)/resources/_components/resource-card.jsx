
import Link from "next/link";
import Image from "next/image";
import { BookOpen } from "lucide-react";

export const ResourceCard = ({ 
    id,
    name,
    users,
 }) => {


  return (
    <Link href={{
      pathname:`/resources/${id}`,
      query: {
        id: id,
      },
      }}>
    <div className="group hover:shadow-sm transition overflow-hidden border rounded-lg p-3 h-full">
      <div className="relative w-full aspect-video rounded-md overflow-hidden">
        <Image
          fill
          className="object-cover"
          alt="title"
          src="/logo.png"
        />
      </div>
      <div className="flex flex-col pt-2">
        <div className="text-lg md:text-base font-medium group-hover:text-sky-700 transition line-clamp-2">
          Week/s {name}
        </div>
        <p className="text-xs ">
          {users.map((user, index) => (
            <span key={index}>
             CI: {user.firstName} {user.lastName}
            </span>
          ))}
        </p>
        <div className="my-3 flex items-center gap-x-2 text-sm md:text-xs">
          <div className="flex items-center gap-x-1 text-slate-500">
            <BookOpen />
          </div>
        </div>
      </div>
    </div>
  </Link>
  );
};

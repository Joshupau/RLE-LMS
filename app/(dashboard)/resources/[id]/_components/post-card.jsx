import Image from "next/image";
import {
  Copy,
  Trash2,
  Pencil,
  MoreVertical,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export const PostCard = ({ uploadLinks, author, content, id }) => {

  const onDelete = () =>{
    
  }
  const isImage = (url) => {
    const imageExtensions = [".jpg", ".jpeg", ".png", ".gif"];
    return imageExtensions.some((ext) => url.toLowerCase().endsWith(ext));
  };
  
  return (
    <div className="m-4 md:w-[40rem] shadow-md border rounded border-gray-300 p-2 mx-auto flex flex-col items-start h-auto">
      <div className=" p-2 cursor-pointer w-full flex justify-between"> {/* Changes here */}
        
        <p className="mb-4">
          {author.firstName} {author?.middleName} {author.lastName}
        </p>
            <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <MoreVertical className="hover:opacity-70 rounded-full w-10 p-2 h-10  hover:bg-slate-200"/>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <Pencil className="mr-2 h-4 w-4" />
                <span>Edit Post</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Trash2 className="mr-2 h-4 w-4" />
                <span>Delete Post</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Copy className="mr-2 h-4 w-4" />
                <span>Copy Link</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
        
      </div>
      <div>
        {content && (
          <div
            className="rounded-md  bg-background p-4 ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-y"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        )}
      </div>

      <div className="flex-wrap w-full justify-center">
        {uploadLinks.map((link, index) => (
          <div key={index}>
            {isImage(link) ? (
              <img
                src={link}
                alt={`Image from ${link}`}
                className="w-full h-auto my-2 object-cover rounded-md"
              />
            ) : (
            
            <>

        <div className="border flex items-center">
            <Image
            height={140}
            width={140}
            alt={link}
            src="/logo.png" 
            className="w-full h-auto object-cover rounded-md border max-h-[10rem] max-w-[10rem] mr-4"
            />
              <a
                href={link}
                target="_blank"
                rel="noreferrer noopener"
                className="m-2 underline text-blue-500 hover:text-blue-700"
              >
                {link.split('/').pop()}
              </a>
           </div>

            </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

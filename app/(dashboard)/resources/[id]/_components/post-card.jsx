'use client';

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
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useEdgeStore } from "@/lib/edgestore";
import EditPost from "./edit-post";
import { useRouter } from "next/navigation";


export const PostCard = ({ resourceGroupId, uploadLinks, author, content, id, user, createdAt, updatedAt }) => {
  const { edgestore } = useEdgeStore();

  const router = useRouter();

  const onDelete = async (id, uploadLinks, resourceGroupId) => {
    try {
      console.log(id, uploadLinks, "TRYING TO DELETE");

      const response = await fetch(`/api/resource/${id}?id=${id}`, {
        method: 'DELETE'
      });
      if(!response.ok){
        throw new Error('Failed to delete resource');
      }
      if(response.ok){
        if(uploadLinks){
          await uploadLinks.map((links) =>{
            edgestore.publicFiles.delete({
              url: links,
            });
          });
          router.push(`${resourceGroupId}?id=${resourceGroupId}`);
        }
      }

      console.log("SUCCESFULLY DELETED RESOURCE");
    } catch (error) {
      console.error('Error deleting resource:', error);     
    }
  }
  const isImage = (url) => {
    const imageExtensions = [".jpg", ".jpeg", ".png", ".gif"];
    return imageExtensions.some((ext) => url.toLowerCase().endsWith(ext));
  };
  const isEqual = (createdAt, updatedAt) => {
    const createdAtString = new Date(createdAt).toISOString();
    const updatedAtString = new Date(updatedAt).toISOString();
  return createdAtString === updatedAtString;
  }
  
  return (
    <div className="m-4 md:w-[40rem] shadow-md border rounded border-gray-300 p-2 mx-auto flex flex-col items-start h-auto">
      <div className="flex justify-between p-2 cursor-pointer w-full"> 
        <div>
        <p>
          {author.firstName} {author?.middleName} {author.lastName}
        </p>
        <p className="text-gray-500 text-xs">
          {isEqual(createdAt, updatedAt) ? (
            `${new Date(createdAt).toLocaleString()}`
            ) : (
              `Updated: ${new Date(updatedAt).toLocaleString()}`
        )}
      </p>
        </div>   
        {author.id === user &&(

          <Dialog>
          <DropdownMenu>
          <DropdownMenuTrigger>
            <MoreVertical className="hover:opacity-70 rounded-full w-10 p-2 h-10  hover:bg-slate-200"/>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuGroup>
              <DropdownMenuItem>
                  <DialogTrigger className="flex justify-start">
                <Pencil className="mr-2 h-4 w-4" />
                <span>Edit Post</span>
                  </DialogTrigger>
              </DropdownMenuItem>
              <DropdownMenuItem
              onClick={()=>onDelete(id, uploadLinks, resourceGroupId)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                <span >Delete Post</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Copy className="mr-2 h-4 w-4" />
                <span>Copy Link</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
             <DialogTitle>Edit Post</DialogTitle>
                <DialogDescription>
                  Make changes to your post here. Click save when you're done.
                </DialogDescription>
           </DialogHeader>
                <EditPost resourceGroupID={resourceGroupId} uploadLinks={uploadLinks} descriptions={content} id={id} userId={user}/>              
            </DialogContent>
      </Dialog>
        
              )}
              
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

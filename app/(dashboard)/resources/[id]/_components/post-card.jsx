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

import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";


export const PostCard = ({ resourceGroupId, uploadLinks, author, content, id, user, createdAt, updatedAt }) => {
  const { edgestore } = useEdgeStore();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);

  const router = useRouter();

  const onDelete = async (id, uploadLinks) => {
    try {

      console.log(id)
      const response = await fetch(`/api/resource/${id}/delete`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });
      if(!response.ok){
        router.refresh();
        throw new Error('Failed to delete resource');
      }
      if(response.ok){
        if(uploadLinks){
          await uploadLinks.map((links) =>{
            edgestore.publicFiles.delete({
              url: links,
            });
          });
          toast({
            title: "Success",
            description: "Successfully deleted resource.",
            status: "Success"
          })
          router.refresh();
        }
      }
    } catch (error) {
      console.error('Error deleting resource:', error);
      toast({
        title: "Uh oh...",
        description: "Failed to delete resource.",
        status: "destructive"
      })     
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
  const handleCloseDialog = () => {
    setOpen(false);
  };
  return (
    <div className="m-4 bg-white md:w-[40rem] shadow-md border rounded border-gray-300 p-2 mx-auto flex flex-col  h-auto">
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

          <Dialog open={open} onOpenChange={setOpen}>
          <DropdownMenu>
          <DropdownMenuTrigger>
            <MoreVertical className="hover:opacity-70 rounded-full w-10 p-2 h-10  hover:bg-slate-200"/>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuGroup>
              <DropdownMenuItem>
                  <DialogTrigger className="flex w-full justify-start">
                <Pencil className="mr-2 h-4 w-4" />
                <span>Edit Post</span>
                  </DialogTrigger>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Copy className="mr-2 h-4 w-4" />
                <span>Copy Link</span>
              </DropdownMenuItem>
              <DropdownMenuItem
              onClick={()=>onDelete(id, uploadLinks)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                <span >Delete Post</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
        <DialogContent className="overflow-scroll">
          <DialogHeader>
             <DialogTitle>Edit Post</DialogTitle>
                <DialogDescription>
                  Make changes to your post here. Click save when you're done.
                </DialogDescription>
           </DialogHeader>
                <EditPost onClose={handleCloseDialog} resourceGroupID={resourceGroupId} uploadLinks={uploadLinks} descriptions={content} id={id} userId={user}/>              
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

      <div className="flex-wrap items-center h-auto justify-center text-center">
        {uploadLinks.map((link, index) => (
         <div key={index} className="overflow-hidden items-center"> 
          {isImage(link) ? (
              <Image
                src={link}
                alt={`Image from ${link}`}
                className="w-full h-[40rem] object-cover rounded-md max-w-full" 
                width={500}
                height={300}
                />
            ) : (
            
            <>

        <div className="border mt-2 flex items-center">
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

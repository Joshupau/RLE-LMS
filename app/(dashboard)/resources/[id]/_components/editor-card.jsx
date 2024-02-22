'use client'
import { Ghost } from 'lucide-react';
import { useSession } from 'next-auth/react';
import ExpandableTextarea from "@/components/expandable-text-area"


export const EditorCard = ({id}) => {
  const {data: session } = useSession(); 
  
  const userId = session?.token.id;

    return (
        <div className="m-4 md:w-[40rem] shadow-xl p-2 mx-auto flex items-center">
              <div className="rounded-full overflow-hidden mr-4">
                 <Ghost className="h-10 w-10" alt="User Icon" />
            </div>
        <div className="flex-grow">
              <ExpandableTextarea userId={userId} id={id} />
        </div>
      </div>
    )
}
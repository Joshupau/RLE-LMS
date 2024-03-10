import { getServerSession } from "next-auth";
import { EditorCard } from "./_components/editor-card"
import { PostList } from "./_components/post-list";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";


export default async function ResourceIdPage({searchParams}) {
  const resourceGroupId = searchParams.id;

  const data = await getServerSession(authOptions);

  return (
    <div>
        <div className="flex flex-col items-center justify-center mt-20">
            <div>
              Banner
            </div>
            <div className="mt-8 my-5 w-full">
               <EditorCard id={resourceGroupId}/>
            </div>
            <div className="my-5">
               <PostList id={resourceGroupId} user={data.token.id}/>
            </div>

        </div>
    </div>
  )
}


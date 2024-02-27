import { EditorCard } from "./_components/editor-card"
import { PostList } from "./_components/post-list";
import { Suspense } from "react";


export default async function ResourceIdPage({searchParams}) {
  const resourceGroupId = searchParams.id;

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
               <PostList id={resourceGroupId}/>
            </div>

        </div>
    </div>
  )
}


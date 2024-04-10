import { getServerSession } from "next-auth";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";

import { Suspense } from "react";
import { PostCard } from "./_components/post-card";
import { Skeleton } from "@/components/ui/skeleton"
import { getResourcePosts } from "@/actions/get-resource-post";
import ExpandableTextarea from "@/components/expandable-text-area";
import { Ghost } from 'lucide-react';

import { getResourceGroupIds } from "@/actions/get-resource-group-ids";
import { SkeletonCard } from "@/components/skeleton-loader";
import { Card, CardContent } from "@/components/ui/card";
import { getScheduleInResource } from "@/actions/get-schedule-in-resource";

export default async function ResourceIdPage({ params, searchParams }) {

  const { id } = params;

  const data = await getServerSession(authOptions);
  const resourcePost = await getResourcePosts(id);
  const scheduledata = await getScheduleInResource(id);

  function getShift(clinicalHours) {
    switch (Number(clinicalHours)) {
      case 1:
        return "AM Shift";
      case 2:
        return "PM Shift";
      case 3:
        return "Graveyard Shift";
      default:
        return "";
    }
  }
  
  return (
    <div className="h-full">
        <div className="grid md:grid-cols-3 mt-20">
        <div className="flex justify-end mt-8 mr-4">
          <Card className="w-64 h-[10rem] shadow-lg">
            <CardContent>
              <h1 className="font-bold text-xl mb-4">Schedule Details</h1>
              <div className="flex flex-col">
                <div className="flex justify-start">
                  <p className="font-semibold mr-1">Week:</p>
                  <p>{scheduledata.week}</p>
                </div>
                <div className="flex justify-start">
                  <p className="font-semibold mr-1">Area: </p>
                  <p>{scheduledata.clinicalArea.name}</p>
                </div>
                <div className="flex justify-start">
                  <p className="font-semibold mr-1">Shift: </p>
                  <p>{getShift(scheduledata.clinicalHours)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

           <div className="items-center justify-center">
            <div className="mt-8 my-5 w-full bg-white">
            <div className="m-4 md:w-[40rem] bg-white border-2 shadow-xl p-2 mx-auto flex items-center">
              <div className="rounded-full  bg-white overflow-hidden mr-4">
                 <Ghost className="h-10 w-10" alt="User Icon" />
            </div>
                <div className="flex-grow  bg-white">
              <ExpandableTextarea id={id} />
              </div>
           </div>
          </div>
            <div className=" w-full my-5">
            <Suspense fallback={<SkeletonCard />}>
              {resourcePost ? (
                <>
                {resourcePost.length > 0 ? (
                  
                  resourcePost.map((post) => (
                    <PostCard
                    key={post.id}
                    id={post.id}
                    resourceGroupId={searchParams.id}
                    content={post.description}
                    uploadLinks={post.uploadLinks}
                    author={post.author}
                    user={data.token.id}
                    createdAt={post.createdAt}
                    updatedAt={post.updatedAt}
                    />
                  )) 
                ):(
                  <>
                  <div className="flex items-center justify-center">
                    No POSTS AVAILABLE
                  </div>
                  </>
                )}
                
                </>
              ) : (
                <div className="flex flex-col space-y-3">
                    <div className="space-y-2">
                    <Skeleton className="h-4 w-[500px]" />
                    <Skeleton className="h-4 w-[600px]" />
                    </div>
                    <Skeleton className="h-[450px] w-[650px] rounded-xl" />
                </div>
              )}
      </Suspense>
        </div>
        </div>
      </div>
    </div>
  )
}

export async function generateStaticParams() {
  const resourceGroupIds = await getResourceGroupIds(); 

  return resourceGroupIds.map((group)=>({
    id: group.id
  }))
}

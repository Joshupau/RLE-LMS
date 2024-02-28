
import { Suspense } from "react";
import { PostCard } from "./post-card";
import Loading from "../loading";
import { Skeleton } from "@/components/ui/skeleton"
import { getResourcePosts } from "@/actions/get-resource-post";


async function getResourcePost(id) {
  try {
    const response = await getResourcePosts(id);

    return response;
  } catch (error) {
    console.error('Error fetching resources:', error);
  }
};

export const PostList = async ({ id }) => {

  const resourcePost = await getResourcePost(id);

 console.log("Resource post in page",resourcePost);
  return (
    <div>
      <Suspense fallback={<Loading />}>
        {resourcePost ? (
          <>
          {resourcePost.length > 0 ? (
            
            resourcePost.map((post) => (
             <PostCard
               key={post.id}
               id={post.id}
               content={post.description}
               uploadLinks={post.uploadLinks}
               author={post.author}
             />
           )) 
          ):(
             <>
             <div>
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
    
  );
};

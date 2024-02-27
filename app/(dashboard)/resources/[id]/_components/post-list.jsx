"use client"

import React, { Suspense, useEffect, useState } from "react";
import { PostCard } from "./post-card";
import Loading from "../loading";
import { Skeleton } from "@/components/ui/skeleton"


export const PostList = ({ id }) => {
  const [resourcePost, setResourcePost] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Track loading state

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const response = await fetch(`/api/getResourcePost?resourceGroupId=${id}`);

        if (!response.ok) {
          throw new Error("Failed to fetch Resources");
        }

        const posts = await response.json();
        setResourcePost(posts);
      } catch (error) {
        console.error("Error fetching resources:", error);
      } finally {
        setIsLoading(false); // Mark loading as complete even on errors
      }
    };

    fetchResources();
  }, [id]);

  return (
    <div>
      <Suspense fallback={<Loading />}>
        {isLoading ? (
            <div className="flex flex-col space-y-3">
            <div className="space-y-2">
            <Skeleton className="h-4 w-[500px]" />
            <Skeleton className="h-4 w-[600px]" />
            </div>
            <Skeleton className="h-[450px] w-[650px] rounded-xl" />
        </div>
        ) : (
          resourcePost.map((post) => (
            <PostCard
              key={post.id}
              id={post.id}
              content={post.description}
              uploadLinks={post.uploadLinks}
              author={post.author}
            />
          ))
        )}
      </Suspense>
    </div>
  );
};

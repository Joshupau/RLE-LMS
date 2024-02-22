"use client"

import { useEffect, useState } from "react"
import { PostCard } from "./post-card"


export const PostList = ({id}) => {

    const [resourcePost, setResourcePost] = useState([]);

    useEffect(()=>{
        const fetchResources = async () => {
            const response = await fetch(`/api/getResourcePost?resourceGroupId=${id}`);
    
            if (!response.ok) {
                console.error('Failed to fetch Resources');
                return;
              }  
              const posts = await response.json();
              
              setResourcePost(posts);
            }

        fetchResources();
    }, [id]);

    return (
        <div>
            {resourcePost.map((post)=>(
                <PostCard
                key={post.id}
                description={post.description}
                uploadLinks={post.uploadLinks}
                author={post.author}
                />
            ))}
        </div>
    )
}
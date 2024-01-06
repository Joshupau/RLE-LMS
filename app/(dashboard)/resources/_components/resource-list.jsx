'use client'

import { useSession } from "next-auth/react"
import { ResourceCard } from "./resource-card";
import { useEffect, useState } from "react";


export const ResourceList = () => {
    
    const { data: session } = useSession();

    const userId = session?.token.id;

    const [resource, setResource] = useState([]);

    useEffect(() => {
      if (!userId) {
        return;
      }
      const fetchResources = async () => {
        try {
          const response = await fetch(`/api/getResource?userId=${userId}`);
  
          if (!response.ok) {
            console.error('Failed to fetch Resources');
            return;
          }
  
          const resources = await response.json();
          setResource(resources.resourceGroup);
        } catch (error) {
          console.error('Error fetching resources:', error);
        }
      };
  
      fetchResources();
    }, [userId]);
  
    console.log(resource);
    return (
        <div>
            <div className="grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-4">
            {resource.length > 0 ? (
                resource.map((item) => (
                    <ResourceCard
                        key={item.id}
                        id={item.id}
                        name={item.name}
                        users={item.users}
                    />
                ))
                ) : (
                <p>Loading...</p>
                )}
         
            </div>
        </div>
    )
}
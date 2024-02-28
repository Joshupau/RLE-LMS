import { cookies } from 'next/headers'
import { ResourceCard } from "./resource-card";
import { Skeleton } from "@/components/ui/skeleton";
import { headers } from "next/headers";
import { getResourceGroup } from '@/actions/get-resourcegroups';

async function getresource(userId) {
  try {
    const response = await getResourceGroup(userId);

    return response.resourceGroup;
  } catch (error) {
    console.error('Error fetching resources:', error);
  }
};

export const ResourceList = async ({ userId }) => {

  const resource = await getresource(userId);

  return (
    <div>
      {resource ? (
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
            <div className="flex flex-wrap space-y-3">
              <p>No resources found for this user.</p>
            </div>
          )}
        </div>
      ) : (
        <Skeleton className="h-[275px] w-[650px] rounded-xl" />
      )}
    </div>
  );
};
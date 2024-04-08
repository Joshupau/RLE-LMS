import { getServerSession } from "next-auth";
import { ResourceList } from "./_components/resource-list";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export default async function ResourcePage() {

  const data = await getServerSession(authOptions);

  const userId = data.token.id;

  return (
    <div className="p-6 mt-20 space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      </div>
          <ResourceList userId={userId} />
    </div>
  )
}


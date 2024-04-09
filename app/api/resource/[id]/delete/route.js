import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function DELETE(req, res) {  
    if(!req.method === 'DELETE'){
      return NextResponse.json({ status: 500 }, "Internal server error");
  
    }
  
    try {
     const { id } = await req.json();
  
      const deletedResource = await db.resource.delete({
        where: { id },
      });
      
      if (!deletedResource) {
          return new NextResponse.json("resource post not found", { status: 404 });
      }
  
      return NextResponse.json(deletedResource);
  } catch (error) {
      console.log("[RESOURCE_DELETE]", error)
      return new NextResponse("Internal Error", { status: 500 });
  }
  }
  
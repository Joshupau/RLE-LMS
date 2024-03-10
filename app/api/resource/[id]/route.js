import { NextResponse } from 'next/server';

import { PrismaClient } from '@prisma/client';


export async function DELETE(req, res) {
  const prisma = new PrismaClient();

  try {
    const url = new URL(req.url);
    const searchparams = new URLSearchParams(url.searchParams);
    const id = searchparams.get('id');


    const deletedResource = await prisma.resource.delete({
      where: { id },
    });
    
    if (!deletedResource) {
        return new NextResponse.json("resource post not found", { status: 404 });
    }
    if(deletedResource){
        console.log("success in deleting resource post");
    }

    return NextResponse.json(deletedResource);
} catch (error) {
    console.log("[RESOURCE_DELETE]", error)
    return new NextResponse("Internal Error", { status: 500 });
} finally {
    await prisma.$disconnect();
  }
}

import { initEdgeStore } from '@edgestore/server';
import { createEdgeStoreNextHandler } from '@edgestore/server/adapters/next/app';

const es = initEdgeStore.create();

/**
 * This defines the main router for your EdgeStore buckets.
 */
const edgeStoreRouter = es.router({
  publicFiles: es.fileBucket(), // Create a "publicFiles" bucket for public assets

});

const handler = createEdgeStoreNextHandler({
  router: edgeStoreRouter,
});

export { handler as GET, handler as POST };

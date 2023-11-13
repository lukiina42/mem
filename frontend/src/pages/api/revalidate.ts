// import { NextApiRequest, NextApiResponse } from "next";

// export default async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse
// ) {
//   console.log(req.query);
//   // Check for secret to confirm this is a valid request
//   if (req.query.secret !== process.env.REVALIDATION_TOKEN) {
//     return res.status(401).json({ message: "Invalid token" });
//   }

//   const idToRevalidate = req.query.id;

//   try {
//     // This should be the actual path not a rewritten path
//     // e.g. for "/blog/[slug]" this should be "/blog/post-1"
//     await res.revalidate(`/${idToRevalidate}`);
//     return res.json({ revalidated: true });
//   } catch (err) {
//     // If there was an error, Next.js will continue
//     // to show the last successfully generated page
//     return res.status(500).send("Error revalidating");
//   }
// }

import { NextRequest } from 'next/server'
import { revalidateTag } from 'next/cache'
 
export default async function GET(request: Request) {
  const tag = request.query.tag
  console.log(tag)
  if(!tag) return Response.json({ revalidated: false, now: Date.now() })
  revalidateTag(tag)
  return Response.json({ revalidated: true, now: Date.now() })
}

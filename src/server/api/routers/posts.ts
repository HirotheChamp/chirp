import { clerkClient } from "@clerk/nextjs";
import { User } from "@clerk/nextjs/dist/api";

import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

const filterUserForClient = (user: User) => {
  return {
    id:user.id, 
    username: user.username,
    profileImageUrl: user.profileImageUrl,
  };
}

export const postsRouter = createTRPCRouter({
 
  getAll: publicProcedure.query( async ({ ctx }) => {
    const posts = await ctx.prisma.post.findMany({
      take: 100,
    });


    //get all the users for the posts
    const users = (await clerkClient.users.getUserList({
      userId: posts.map((post) => post.authorId),
      limit: 100,
    })
    ).map(filterUserForClient);
    

    //for each post we are grabbing the author that made it
    //This code throws an error if there is no author found for a given post
    return posts.map((post) => {
      const author = users.find((user) => user.id ===post.authorId);

      if (!author || !author.username) 
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
      message: "Author for post not found",
    });
  
    return {
      post,
      author: {
        ...author,
        username: author.username,
      }
    }
    });
   
  }),
});
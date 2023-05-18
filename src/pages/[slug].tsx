

import type { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import { api } from "~/utils/api";
import { createServerSideHelpers } from '@trpc/react-query/server';
import { appRouter } from "~/server/api/root";
import {prisma} from "~/server/db"
import Image from "next/image";
import superjson from "superjson";
import { PageLayout } from "~/components/layout";




const ProfilePage: NextPage<{username: string}> = ( {username} ) => {
 

const {data} = api.profile.getUserByUsername.useQuery({
  username,
})


if(!data) return <div>404</div>


 
  return (
    <>
      <Head>
        <title>{data.username}</title>
     
      </Head>
      <PageLayout>
       
      <div className=" h-48  bg-slate-600 relative">
        <Image 
        src={data.profileImageUrl} 
        alt={`${data.username ?? ""}'s profile pic `}
        width={128}
        height={128}

        className="-mb-[64px] absolute bottom-0 left-0 ml-4 rounded-full border-4 border-black"
        />
      <div>{data.username}</div>
      </div>
     </PageLayout>
    </>
  );
};

export const getStaticProps: GetStaticProps = async (context) => {
  const ssg = createServerSideHelpers({
    router: appRouter,
    ctx: { prisma, userId: null },
    transformer: superjson,
  })

  const slug = context.params?.slug;

  if (typeof slug !== "string") throw new Error("no slug");

  const username = slug.replace("@", "");

  await ssg.profile.getUserByUsername.prefetch({ username});

  return {
    props:{
      trpcState: ssg.dehydrate(),
      username,
    },
  };
};

export const getStaticPaths = () => {

  return {paths: [], fallback: "blocking"}
}

export default ProfilePage;

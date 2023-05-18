
import { useUser } from "@clerk/nextjs";
import { type NextPage } from "next";
import Head from "next/head";


import { api } from "~/utils/api";

const ProfilePage: NextPage = () => {
 





 
  return (
    <>
      <Head>
        <title>Chirp</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex h-screen justify-center">
        <div>Profile View</div>
      
      </main>
    </>
  );
};

export default ProfilePage;

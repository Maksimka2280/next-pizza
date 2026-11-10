"use client";

import { useSession } from "next-auth/react";
import { SidebarProvider } from "../ui/sidebar";
import { ProfileSidebar } from "./ProfileSidebar";
import { Bell, Box, Heart, Pen, Phone, User } from "lucide-react";
import { Playwrite_CA_Guides } from "next/font/google";
import { Button } from "../ui/button";
import { ProfileInfo } from "./ProfileInfo";
import { ProfileLilInfo } from "./ProfileLIlInfo";

export const PageProfile = () => {
  const { data: session, status } = useSession();
  const user = session?.user;
  return (
    <>
      <ProfileSidebar />
      <div className="flex flex-col gap-[50px]">
        <ProfileInfo user={user} />
        <ProfileLilInfo />
        <div></div>
        <div></div>
        <div></div>
      </div>
    </>


  );
};

import { getServerSession } from "next-auth";
import MainHeaderClient from "./MainHeaderClient";
import { authOptions } from "@/auth";

export default async function MainHeader() {
  const session = await getServerSession(authOptions);

  return (
    <MainHeaderClient
      isAuthenticated={!!session?.user?.id}
    />
  );
}
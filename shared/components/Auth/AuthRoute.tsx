"use client";

import { useRouter } from "next/navigation";
import { LoginWindow } from "./Login";
import { RegisterWindow } from "./Register";

export function LoginRoute() {
  const router = useRouter();

  return (
    <LoginWindow
      onClose={() => router.push("/")}
      onRegister={() => router.push("/register")}
    />
  );
}

export function RegisterRoute() {
  const router = useRouter();

  return <RegisterWindow onClose={() => router.push("/login")} />;
}

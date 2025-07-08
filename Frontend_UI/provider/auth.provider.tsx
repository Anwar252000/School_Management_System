"use client";

import useAuth from "@/hooks/use-auth";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

export default AuthProvider;

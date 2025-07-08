"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/services/reduxStore";
import ReduxProvider from "@/provider/redux.provider";
import Providers from "@/provider/providers";
import TanstackProvider from "@/provider/providers.client";
import DirectionProvider from "@/provider/direction.provider";
import AuthProvider from "@/provider/auth.provider";
import { ThemeProvider } from "next-themes";

const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const userId = useSelector((state: RootState) => state.auth.user?.userId);

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    if (!userId) {
      router.replace("/auth/login");
    }
  }, [userId, router]);

  if (!isClient) return null;

  return <>{children}</>;
};

const ClientLayout = ({
  children,
  lang,
}: {
  children: React.ReactNode;
  lang: string;
}) => {
  // 🔥 Prevent rendering before hydration completes
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <ReduxProvider>
      <AuthProvider>
        <TanstackProvider>
          <ThemeProvider attribute="class">
            <Providers>
              <AuthGuard>
                <DirectionProvider lang={lang}>{children}</DirectionProvider>
              </AuthGuard>
            </Providers>
          </ThemeProvider>
        </TanstackProvider>
      </AuthProvider>
    </ReduxProvider>
  );
};

export default ClientLayout;

"use client";

import React, { ReactNode, useEffect, useMemo } from "react";
import { usePathname } from "next/navigation";
import "../globals.css";
import WebLayout from "./WebLayout";

interface LayoutWrapperProps {
  children?: ReactNode;
  access_token?: string;
}

const LayoutWrapper: React.FC<LayoutWrapperProps> = React.memo(({
  children,
  access_token,
}: LayoutWrapperProps) => {
  const pathname = usePathname();

  // Memoize access token setting to prevent unnecessary effects
  useEffect(() => {
    if (access_token) {
      localStorage.setItem("access_token", access_token);
    }
  }, [access_token]);

  // Memoize the condition for rendering without layout
  const isNoLayoutPage = useMemo(() =>
    ['/login', '/onboarding', '/onboarding/underreview'].includes(pathname),
    [pathname]
  );

  // If it's a no-layout page, render children directly
  if (isNoLayoutPage) {
    return <>{children}</>;
  }

  // Wrap children in WebLayout for other routes
  return <WebLayout>{children}</WebLayout>;
});

// Add display name for better debugging
LayoutWrapper.displayName = 'LayoutWrapper';

export default LayoutWrapper;
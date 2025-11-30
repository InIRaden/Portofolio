"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import AdminNav from "@/components/AdminNav";

export default function AdminLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Skip auth check for login page
    if (pathname === "/admin/login") {
      setIsLoading(false);
      return;
    }

    // Check authentication
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/auth/check");
        const data = await response.json();

        if (data.authenticated) {
          setIsAuthenticated(true);
        } else {
          router.push("/admin/login");
        }
      } catch (error) {
        console.error("Auth check error:", error);
        router.push("/admin/login");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [pathname, router]);

  // Show loading for protected routes
  if (isLoading && pathname !== "/admin/login") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-primary">
        <div className="text-2xl text-accent">Loading...</div>
      </div>
    );
  }

  // Login page doesn't need nav
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  // Protected routes with nav
  if (isAuthenticated) {
    return (
      <div className="min-h-screen bg-primary">
        <AdminNav />
        <main className="container mx-auto px-4 py-8">{children}</main>
      </div>
    );
  }

  return null;
}

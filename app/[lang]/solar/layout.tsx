"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import ModuleSidebar from "@/components/partials/sidebar/module";
import { useSidebar } from "@/store";
import { cn } from "@/lib/utils";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const { collapsed, subMenu } = useSidebar();

  useEffect(() => {
    const session = JSON.parse(localStorage.getItem("session") || "{}");
    const groups = session?.user?.groups || [];

    if (!session?.token || !groups.includes("solar")) {
      router.push("/auth/login");
    }
  }, [router]);

  return (
    <>
      <ModuleSidebar trans={{}} />
      <main
        className={cn(
          "transition-all duration-300 overflow-y-auto h-screen",
          {
            "ml-[316px]": !collapsed && !subMenu, // 300 + 16px espacio
            "ml-[88px]": collapsed || subMenu,   // 72 + 16px espacio
          }
        )}
      >
        {children}
      </main>
    </>
  );
};

export default Layout;

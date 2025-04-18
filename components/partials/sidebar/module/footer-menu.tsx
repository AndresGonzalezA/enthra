"use client";

import React, { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Settings } from "@/components/svg";

const FooterMenu = () => {
  const [user, setUser] = useState<{ name: string; image?: string } | null>(null);

  useEffect(() => {
    const session = JSON.parse(localStorage.getItem("session") || "{}");
    if (session?.user) {
      setUser({
        name: session.user.name || "Usuario",
        image: session.user.image || null,
      });
    }
  }, []);

  return (
    <div className="space-y-5 flex flex-col items-center justify-center pb-6">
      <button className="w-11 h-11 mx-auto text-default-500 flex items-center justify-center rounded-md transition-all duration-200 hover:bg-primary hover:text-primary-foreground">
        <Settings className="h-8 w-8" />
      </button>
      {user?.image ? (
        <Avatar>
          <AvatarImage src={user.image} />
          <AvatarFallback>{user.name?.[0] ?? "U"}</AvatarFallback>
        </Avatar>
      ) : null}
    </div>
  );
};

export default FooterMenu;

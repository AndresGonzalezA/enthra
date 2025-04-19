"use client";

import React, { useEffect, useState } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { LogOut } from "lucide-react";
import { CognitoUser, CognitoUserPool } from "amazon-cognito-identity-js";

const poolData = {
  UserPoolId: "us-east-1_7H7VPIa0F",
  ClientId: "26n7oqrpvnfm246b5sdffll6m6",
};

const userPool = new CognitoUserPool(poolData);

const FooterMenu = () => {
  const [user, setUser] = useState<{ name: string; image?: string; email?: string } | null>(null);

  useEffect(() => {
    const session = JSON.parse(localStorage.getItem("session") || "{}");
    if (session?.user) {
      setUser({
        name: session.user.name || "Usuario",
        image: session.user.image || null,
        email: session.user.email || "",
      });
    }
  }, []);

  const handleLogout = () => {
    if (user?.email) {
      const cognitoUser = new CognitoUser({
        Username: user.email,
        Pool: userPool,
      });
      cognitoUser.signOut();
    }

    localStorage.clear();
    window.location.href = "/auth/login";
  };

  return (
    <div className="space-y-5 flex flex-col items-center justify-center pb-6">
      <button
        className="w-11 h-11 mx-auto text-[#F79E00] hover:text-[#0F1A2D] flex items-center justify-center rounded-full transition-all duration-200"
        onClick={handleLogout}
      >
        <LogOut className="h-5 w-5" />
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

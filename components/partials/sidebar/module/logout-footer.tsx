"use client";

import { useRouter } from "next/navigation";
import { CognitoUser, CognitoUserPool } from "amazon-cognito-identity-js";
import { Button } from "@/components/ui/button";

const poolData = {
  UserPoolId: "us-east-1_7H7VPIa0F",
  ClientId: "26n7oqrpvnfm246b5sdffll6m6",
};

const userPool = new CognitoUserPool(poolData);

const LogoutFooter = () => {
  const router = useRouter();

  const handleLogout = () => {
    const session = JSON.parse(localStorage.getItem("session") || "{}");
    const user = session?.user;

    if (user) {
      const cognitoUser = new CognitoUser({
        Username: user.email,
        Pool: userPool,
      });
      cognitoUser.signOut();
    }

    localStorage.clear();
    router.push(`/${navigator.language || "es"}/auth/login`);
  };

  return (
    <div className="px-4 py-4">
      <Button variant="outline" className="w-full" onClick={handleLogout}>
        Cerrar sesión
      </Button>
    </div>
  );
};

export default LogoutFooter;

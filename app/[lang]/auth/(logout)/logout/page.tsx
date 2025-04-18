"use client";

import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CognitoUser, CognitoUserPool } from "amazon-cognito-identity-js";

const poolData = {
  UserPoolId: "us-east-1_7H7VPIa0F",
  ClientId: "26n7oqrpvnfm246b5sdffll6m6",
};

const userPool = new CognitoUserPool(poolData);

export default function LogoutPage() {
  const router = useRouter();
  const params = useParams();
  const lang = params?.lang || "es";

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
    router.push(`/${lang}/auth/login`);
  };

  return (
    <div className="h-screen flex items-center justify-center bg-background">
      <Button onClick={handleLogout}>
        Cerrar sesión
      </Button>
    </div>
  );
}

"use client";
import React, { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  CognitoIdentityClient,
  GetCredentialsForIdentityCommand,
  GetIdCommand,
} from "@aws-sdk/client-cognito-identity";
import { signIn } from "@/lib/cognito";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { SiteLogo } from "@/components/svg";

const schema = z.object({
  email: z.string().email({ message: "Correo inválido" }),
  password: z.string().min(4, "La contraseña debe tener al menos 4 caracteres"),
});

const LogInForm = () => {
  const [isPending, setIsPending] = useState(false);
  const [passwordType, setPasswordType] = useState("password");
  const router = useRouter();
  const params = useParams();
  const lang = params?.lang || "es";

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    mode: "all",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const togglePasswordType = () => {
    setPasswordType((prev) => (prev === "text" ? "password" : "text"));
  };

  const onSubmit = async (data: { email: string; password: string }) => {
    setIsPending(true);
    try {
      const { user, result } = await signIn(data.email, data.password);
      if (typeof window !== "undefined") localStorage.clear();
      user?.signOut?.();

      const idToken = result.getIdToken().getJwtToken();
      const payload = result.getIdToken().decodePayload();
      const client = new CognitoIdentityClient({ region: "us-east-1" });

      const identity = await client.send(
        new GetIdCommand({
          IdentityPoolId: "us-east-1:b6785497-e43f-4130-ad2e-4132710f1f53",
          Logins: {
            "cognito-idp.us-east-1.amazonaws.com/us-east-1_7H7VPIa0F": idToken,
          },
        })
      );

      const credentials = await client.send(
        new GetCredentialsForIdentityCommand({
          IdentityId: identity.IdentityId,
          Logins: {
            "cognito-idp.us-east-1.amazonaws.com/us-east-1_7H7VPIa0F": idToken,
          },
        })
      );

      if (!credentials.Credentials) throw new Error("No se pudieron obtener las credenciales");

      const groups = payload["cognito:groups"] || [];
      const destino =
        groups.find((g: string) => g.trim().toLowerCase() === "solar")
          ? `/${lang}/solar`
          : `/${lang}/biomedico`;

      localStorage.setItem(
        "session",
        JSON.stringify({
          token: idToken,
          user: {
            id: payload.sub,
            email: payload.email,
            groups,
          },
          credentials: {
            AccessKeyId: credentials.Credentials.AccessKeyId,
            SecretKey: credentials.Credentials.SecretKey,
            SessionToken: credentials.Credentials.SessionToken,
            Expiration: credentials.Credentials.Expiration,
          },
        })
      );

      if (user.challengeName === "NEW_PASSWORD_REQUIRED") {
        router.push("/newpassword");
        return;
      }

      router.push(destino);
      reset();
    } catch {
      console.log("Error de autenticación");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="w-full py-10 text-default-900">
    <div className="mb-6 flex justify-start">
      <SiteLogo className="h-10 w-100" />
    </div>
        <h1 className="text-3xl font-bold mb-2">Inicia sesión</h1>
      <p className="text-base text-default-600 mb-6">
        Accede a tu plataforma IoT de Enthra
      </p>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <Label htmlFor="email">Correo electrónico</Label>
          <Input
            id="email"
            type="email"
            {...register("email")}
            disabled={isPending}
            className={cn("", { "border-destructive": errors.email })}
          />
          {errors.email && (
            <p className="text-destructive text-sm mt-1">{errors.email.message}</p>
          )}
        </div>
        <div>
          <Label htmlFor="password">Contraseña</Label>
          <div className="relative">
            <Input
              id="password"
              type={passwordType}
              {...register("password")}
              disabled={isPending}
            />
            <button
              type="button"
              onClick={togglePasswordType}
              className="absolute inset-y-0 right-3 text-default-400 text-sm"
            >
              {passwordType === "password" ? "Mostrar" : "Ocultar"}
            </button>
          </div>
          {errors.password && (
            <p className="text-destructive text-sm mt-1">{errors.password.message}</p>
          )}
        </div>
        <Button type="submit" className="w-full text-white" disabled={isPending}>
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isPending ? "Ingresando..." : "Ingresar"}
        </Button>

      </form>
    </div>
  );
};

export default LogInForm;

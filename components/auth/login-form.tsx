"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
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
import Link from "next/link";
import Image from "next/image";
import { SiteLogo } from "@/components/svg";
import { Icon } from "@iconify/react";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";
import { useMediaQuery } from "@/hooks/use-media-query";

import googleIcon from "@/public/images/auth/google.png";
import facebook from "@/public/images/auth/facebook.png";
import twitter from "@/public/images/auth/twitter.png";
import GithubIcon from "@/public/images/auth/github.png";

const schema = z.object({
  email: z.string().email({ message: "Tu correo no es válido." }),
  password: z.string().min(4),
});

const LogInForm = () => {
  const [isPending, setIsPending] = useState(false);
  const [passwordType, setPasswordType] = useState("password");
  const isDesktop2xl = useMediaQuery("(max-width: 1530px)");
  const { toast } = useToast();
  const router = useRouter();

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
      if (typeof window !== "undefined") {
        localStorage.clear();
      }
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
      if (!credentials.Credentials) {
        throw new Error("No se pudieron obtener las credenciales");
      };
      
      const groups = payload["cognito:groups"] || [];
      const destino = (
        (groups.find((g: string) => g.trim().toLowerCase() === "biomedico"))
          ? "/dashboard/biomedico"
          : (groups.find((g: string) => g.trim().toLowerCase() === "solar"))
          ? "/dashboard/solar"
          : "/dashboard"
      );      

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
    } catch (error: any) {
      toast({
        title: "Error...",
        description: "...",
      });      
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="w-full py-10">
      <Link href="/dashboard" className="inline-block">
        <SiteLogo className="h-10 w-10 2xl:w-14 2xl:h-14 text-primary" />
      </Link>
      <div className="2xl:mt-8 mt-6 2xl:text-3xl text-2xl font-bold text-default-900">
        Hey, Hello 👋
      </div>
      <div className="2xl:text-lg text-base text-default-600 2xl:mt-2 leading-6">
        Enter the information you entered while registering.
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-5 2xl:mt-7">
        <div>
          <Label htmlFor="email" className="mb-2 font-medium text-default-600">
            Email
          </Label>
          <Input
            disabled={isPending}
            {...register("email")}
            type="email"
            id="email"
            className={cn("", {
              "border-destructive": errors.email,
            })}
            size={!isDesktop2xl ? "xl" : "lg"}
          />
        </div>
        {errors.email && (
          <div className="text-destructive mt-2">{errors.email.message}</div>
        )}
        <div className="mt-3.5">
          <Label
            htmlFor="password"
            className="mb-2 font-medium text-default-600"
          >
            Password
          </Label>
          <div className="relative">
            <Input
              disabled={isPending}
              {...register("password")}
              type={passwordType}
              id="password"
              className="peer"
              size={!isDesktop2xl ? "xl" : "lg"}
              placeholder=" "
            />
            <div
              className="absolute top-1/2 -translate-y-1/2 ltr:right-4 rtl:left-4 cursor-pointer"
              onClick={togglePasswordType}
            >
              {passwordType === "password" ? (
                <Icon icon="heroicons:eye" className="w-5 h-5 text-default-400" />
              ) : (
                <Icon icon="heroicons:eye-slash" className="w-5 h-5 text-default-400" />
              )}
            </div>
          </div>
        </div>
        {errors.password && (
          <div className="text-destructive mt-2">{errors.password.message}</div>
        )}
        <div className="mt-5 mb-8 flex flex-wrap gap-2">
          <div className="flex-1 flex items-center gap-1.5">
            <Checkbox
              size="sm"
              className="border-default-300 mt-[1px]"
              id="isRemebered"
            />
            <Label
              htmlFor="isRemebered"
              className="text-sm text-default-600 cursor-pointer whitespace-nowrap"
            >
              Remember me
            </Label>
          </div>
          <Link href="/auth/forgot" className="flex-none text-sm text-primary">
            Forget Password?
          </Link>
        </div>
        <Button
          className="w-full"
          disabled={isPending}
          size={!isDesktop2xl ? "lg" : "md"}
        >
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isPending ? "Cargando..." : "Sign In"}
        </Button>
      </form>
      <div className="mt-6 xl:mt-8 flex flex-wrap justify-center gap-4">
        <Button
          type="button"
          size="icon"
          variant="outline"
          className="rounded-full border-default-300 hover:bg-transparent"
          disabled={isPending}
        >
          <Image src={googleIcon} alt="google" className="w-5 h-5" priority={true} />
        </Button>
        <Button
          type="button"
          size="icon"
          variant="outline"
          className="rounded-full border-default-300 hover:bg-transparent"
          disabled={isPending}
        >
          <Image src={GithubIcon} alt="github" className="w-5 h-5" priority={true} />
        </Button>
        <Button
          type="button"
          size="icon"
          variant="outline"
          className="rounded-full border-default-300 hover:bg-transparent"
        >
          <Image src={facebook} alt="facebook" className="w-5 h-5" priority={true} />
        </Button>
        <Button
          type="button"
          size="icon"
          variant="outline"
          className="rounded-full border-default-300 hover:bg-transparent"
        >
          <Image src={twitter} alt="twitter" className="w-5 h-5" priority={true} />
        </Button>
      </div>
      <div className="mt-5 2xl:mt-8 text-center text-base text-default-600">
        Don't have an account?
        <Link href="/auth/register" className="text-primary">
          {" "}
          Sign Up{" "}
        </Link>
      </div>
    </div>
  );
};

export default LogInForm;

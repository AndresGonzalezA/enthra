"use client";
import React from "react";
import { useState, useEffect } from "react";
import { useMediaQuery } from "@/hooks/use-media-query";
import { SiteLogo } from "@/components/svg";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import ThemeButton from "@/components/partials/header/theme-button";
import NavMenu from "./nav-menu";
import { menus } from "./../data";
import { Menu } from "lucide-react";

const Header = () => {

  const [scroll, setScroll] = useState<boolean>(false);
  useEffect(() => {
    window.addEventListener("scroll", () => {
      setScroll(window.scrollY > 50);
    });
  }, []);

  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const [open, setOpen] = React.useState<boolean>(false);
  if (!isDesktop) {
    return (
      <>
        <div
          className={
            scroll
              ? "bg-card/50 dark:bg-card/70 backdrop-blur-lg z-50 shadow-sm fixed top-0 left-0 w-full py-3"
              : "fixed top-0 left-0 w-full py-3"
          }
        >
          <nav className="container flex items-center justify-between relative z-50">
            <SiteLogo className="h-8 w-auto text-primary" />
            <div className="flex items-center gap-4">
              <ThemeButton />
              <Button asChild size="sm">
                <Link
                  href="/es/auth/login"
                  className="text-sm font-semibold px-4 h-9 rounded-md bg-primary text-white hover:bg-primary/80 flex items-center"
                >
                  Acceder
                </Link>
              </Button>
              <button type="button">
                <Menu
                  className="h-6 w-6 cursor-pointer"
                  onClick={() => setOpen(!open)}
                />
              </button>
            </div>
            {open && (
              <div className="absolute top-full bg-background rounded-md p-4 w-full shadow-md">
                <ul className="space-y-1.5">
                  {menus?.map((item, i) => (
                    <li
                      key={`main-item-${i}`}
                      className="block text-base font-medium text-default-600 hover:text-primary"
                    >
                      <a href={item.href} onClick={() => setOpen(false)}>
                        {item.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </nav>
        </div>
      </>
    );
  }  
  return (
    <div
      className={
        scroll
          ? "bg-card/50 backdrop-blur-lg shadow-xl z-30 dark:bg-card/70 fixed top-0 left-0 w-full py-3"
          : "z-30 fixed top-0 left-0 w-full py-3"
      }
    >
      <nav className="container flex items-center justify-between">
        <SiteLogo className="h-8 w-auto text-primary" />
  
        <NavMenu />
  
        <div className="flex items-center gap-4">
          <ThemeButton />
          <Button asChild size="sm">
            <Link
              href="/es/auth/login"
              className="text-sm font-semibold px-4 h-9 rounded-md bg-primary text-white hover:bg-primary/80 flex items-center"
            >
              Acceder
            </Link>
          </Button>
        </div>
      </nav>
    </div>
  );
};

export default Header;

import React from "react";
import * as NavigationMenu from "@radix-ui/react-navigation-menu";
import { menus } from "./../data";
import Link from "next/link";

export default function NavMenu() {
  return (
    <div>
      <NavigationMenu.Root className="relative justify-start group z-[9999]">
        <NavigationMenu.List className="group flex list-none gap-8">
          {menus.map((item, index) => (
            <NavigationMenu.Item key={`item-${index}`}>
              <NavigationMenu.Link asChild>
                <Link
                  href={item.href}
                  className="flex items-center px-2 py-4 text-base font-medium text-white hover:text-primary"
                >
                  {item.title}
                </Link>
              </NavigationMenu.Link>
            </NavigationMenu.Item>
          ))}
        </NavigationMenu.List>
      </NavigationMenu.Root>
    </div>
  );
}

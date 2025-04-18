"use client";

import React, { useEffect, useState } from "react";
import { cn, isLocationMatch, getDynamicPath, translate } from "@/lib/utils";
import { menusConfig } from "@/config/menus";
import SingleIconMenu from "./single-icon-menu";
import { useRouter, usePathname } from "next/navigation";
import { useSidebar, useThemeStore } from "@/store";
import MenuItem from "./menu-item";
import NestedMenus from "./nested-menus";
import Link from "next/link";
import FooterMenu from "./footer-menu";
import { SiteLogo } from "@/components/svg";
import { ScrollArea } from "@/components/ui/scroll-area";
import LogoutFooter from "./logout-footer";
import { useMediaQuery } from "@/hooks/use-media-query";
import MenuOverlayPortal from "./MenuOverlayPortal";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const ModuleSidebar = ({ trans }: { trans: any }) => {
  useEffect(() => {
    setCollapsed(true);
    setSubmenu(true);
  }, []);

  const menus = menusConfig?.sidebarNav?.modern || [];
  const { subMenu, setSubmenu, collapsed, setCollapsed, sidebarBg } = useSidebar();
  const { isRtl } = useThemeStore();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [currentSubMenu, setCurrentSubMenu] = useState<any[]>([]);
  const [nestedIndex, setNestedIndex] = useState<number | null>(null);
  const [multiNestedIndex, setMultiNestedIndex] = useState<number | null>(null);
  const [menuOverlay, setMenuOverlay] = useState<boolean>(false);
  const isDesktop = useMediaQuery("(min-width: 1280px)");

  const pathname = usePathname();
  const locationName = getDynamicPath(pathname);

  const toggleSubMenu = (index: number) => {
    setActiveIndex(index);
    if (menus[index].child) {
      setCurrentSubMenu(menus[index].child);
      setSubmenu(false);
      setCollapsed(false);
      if (!isDesktop) setMenuOverlay(true);
    } else {
      setSubmenu(true);
      setCollapsed(true);
      if (!isDesktop && isLocationMatch(menus[index].title, locationName)) {
        setSubmenu(false);
      }
    }
  };

  const toggleNested = (subIndex: number) => {
    setNestedIndex(nestedIndex === subIndex ? null : subIndex);
  };

  const toggleMultiNested = (index: number) => {
    setMultiNestedIndex(multiNestedIndex === index ? null : index);
  };

  const setActiveMenu = (menuIndex: number, childMenu: any) => {
    setActiveIndex(menuIndex);
    setCurrentSubMenu(childMenu);
    setSubmenu(false);
    setCollapsed(false);
  };

  const setActiveNestedMenu = (menuIndex: number, nestedMenuIndex: number, childMenu: any) => {
    setActiveIndex(menuIndex);
    setNestedIndex(nestedMenuIndex);
    setCurrentSubMenu(childMenu);
    setSubmenu(false);
    setCollapsed(false);
  };

  const getMenuTitle = () => (activeIndex !== null ? menus[activeIndex].title : "");

  useEffect(() => {
    let isMenuMatched = false;
    menus.forEach((item: any, i: number) => {
      if (item?.href && isLocationMatch(item.href, locationName)) {
        isMenuMatched = true;
        setSubmenu(true);
        setMenuOverlay(false);
      }

      item?.child?.forEach((childItem: any, j: number) => {
        if (isLocationMatch(childItem.href, locationName)) {
          setActiveMenu(i, item.child);
          setMenuOverlay(false);
          isMenuMatched = true;
        }
        childItem.nested?.forEach((nestedItem: any) => {
          if (isLocationMatch(nestedItem.href, locationName)) {
            setActiveNestedMenu(i, j, item.child);
            setMenuOverlay(false);
            isMenuMatched = true;
          }
          nestedItem.child?.forEach((multiItem: any) => {
            if (isLocationMatch(multiItem.href, locationName)) {
              setActiveNestedMenu(i, j, item.child);
              setMenuOverlay(false);
              isMenuMatched = true;
            }
          });
        });
      });
    });

    if (!isMenuMatched) setSubmenu(false);
    if (!isDesktop) setSubmenu(true);
  }, [locationName, isDesktop]);

  return (
    <>
      <div className="main-sidebar pointer-events-auto fixed z-[60] flex h-screen print:hidden left-0 top-0">
        <div
          className={cn(
            "border-default-200 dark:border-default-300 pointer-events-auto relative z-20 flex h-full w-[72px] flex-col border-r border-dashed bg-card transition-all duration-300",
            {
              "ltr:-translate-x-full rtl:translate-x-full ltr:xl:translate-x-0 rtl:xl:translate-x-0": !collapsed && subMenu,
              "translate-x-0": collapsed && subMenu,
            }
          )}
        >
          <div className="pt-4">
            <Link href="/dashboard">
              <SiteLogo className="mx-auto text-primary h-8 w-8" />
            </Link>
          </div>
          <ScrollArea className="pt-6 grow">
            {menus.map((item, i) => (
              <div key={i} onClick={() => toggleSubMenu(i)} className="mb-3 last:mb-0">
                <SingleIconMenu
                  index={i}
                  activeIndex={activeIndex}
                  item={item}
                  locationName={locationName}
                  trans={trans}
                />
              </div>
            ))}
          </ScrollArea>
          <FooterMenu />
        </div>

        <div
          className={cn(
            "border-default-200 pointer-events-auto relative z-10 flex flex-col h-full border-r bg-card transition-all duration-300",
            {
              "w-[228px]": !collapsed,
              "w-0": collapsed,
            }
          )}
        >
          {sidebarBg !== "none" && (
            <div
              className="absolute left-0 top-0 z-[-1] w-full h-full bg-cover bg-center opacity-[0.07]"
              style={{ backgroundImage: `url(${sidebarBg})` }}
            ></div>
          )}

          <h2 className="text-lg bg-transparent z-50 font-semibold flex gap-4 items-center text-default-700 sticky top-0 py-4 px-4 capitalize">
            {!collapsed && (
              <>
                <span className="block">{translate(getMenuTitle(), trans)}</span>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => {
                    setCollapsed(true);
                    setSubmenu(true);
                    setMenuOverlay(false);
                  }}
                  className="rounded-full h-8 w-8"
                >
                  <ChevronLeft className="w-5 h-5" />
                </Button>
              </>
            )}
          </h2>


          <ScrollArea className="flex-1 overflow-y-auto">
            <div className="px-4" dir={isRtl ? "rtl" : "ltr"}>
              <ul>
                {currentSubMenu?.map((childItem, j) => (
                  <li key={j} className="mb-1.5 last:mb-0">
                    <MenuItem
                      trans={trans}
                      childItem={{
                        ...childItem,
                        onClick: () => {
                          setCollapsed(true);
                          setSubmenu(true);
                        },
                      }}
                      toggleNested={toggleNested}
                      index={j}
                      nestedIndex={nestedIndex}
                      locationName={locationName}
                    />
                    <NestedMenus
                      index={j}
                      nestedIndex={nestedIndex}
                      nestedMenus={childItem.nested}
                      locationName={locationName}
                      toggleMulti={toggleMultiNested}
                      multiIndex={multiNestedIndex}
                      trans={trans}
                    />
                  </li>
                ))}
              </ul>
            </div>
          </ScrollArea>

          {!collapsed && <LogoutFooter />}
        </div>
      </div>

      {!isDesktop && (
      <MenuOverlayPortal
        isOpen={menuOverlay || collapsed}
        onClose={() => {
          setMenuOverlay(false);
          setSubmenu(true);
          setCollapsed(false);
        }}
      />
    )}
    </>
    );
    };

export default ModuleSidebar;



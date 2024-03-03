"use client";
import Link from "next/link";

import { cn } from "@/lib/utils";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { ComponentPropsWithoutRef, ElementRef, forwardRef } from "react";
// models
import { INaviagationConfig } from "@/configs/navigation";
import { usePathname } from "@/lib/navigation";
import { useParams } from "next/navigation";

export function NavigationHeaderMenu({
  navConfig,
}: {
  navConfig: INaviagationConfig[];
}) {
  const pathname = usePathname();
  const { slug } = useParams<{ slug: string; locale: string }>();
  return (
    <NavigationMenu>
      <NavigationMenuList>
        {navConfig.map((item) => {
          if (item.children && item.children.length) {
            const isActive = pathname.startsWith(item.href);
            return (
              <NavigationMenuItem key={item.title}>
                <NavigationMenuTrigger className={isActive ? "bg-accent" : ""}>
                  {item.title}
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                    {item.children.map((itemCh) => {
                      const concatHref = item.href + itemCh.href;
                      const isActive = pathname.startsWith(concatHref);
                      return (
                        <ListItem
                          key={itemCh.title}
                          title={itemCh.title}
                          href={concatHref}
                          className={isActive ? "bg-accent" : ""}
                        />
                      );
                    })}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            );
          } else {
            const isActive =
              pathname === item.href || pathname === `${item.href}/${slug}`;
            return (
              <NavigationMenuItem key={item.title}>
                <Link href={item.href} legacyBehavior passHref>
                  <NavigationMenuLink
                    className={`${navigationMenuTriggerStyle()} ${
                      isActive ? "!bg-accent" : ""
                    }`}
                  >
                    {item.title}
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            );
          }
        })}
      </NavigationMenuList>
    </NavigationMenu>
  );
}

const ListItem = forwardRef<ElementRef<"a">, ComponentPropsWithoutRef<"a">>(
  ({ className, title, href }, ref) => {
    return (
      <li>
        <NavigationMenuLink asChild>
          <Link
            ref={ref}
            className={cn(
              "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
              className
            )}
            href={href ? href : "/"}
          >
            <div className="text-sm font-medium leading-none">{title}</div>
          </Link>
        </NavigationMenuLink>
      </li>
    );
  }
);
ListItem.displayName = "ListItem";

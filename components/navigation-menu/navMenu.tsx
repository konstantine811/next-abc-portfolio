"use client";

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

import { useParams } from "next/navigation";
import { Link, usePathname } from "@/i18n/routing";

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
          if (item.isDev && process.env.NODE_ENV !== "development") {
            return null;
          }
          if (item.children && item.children.length) {
            const isActive = pathname.startsWith(item.href);
            return (
              <NavigationMenuItem key={item.title}>
                <NavigationMenuTrigger
                  className={`${
                    isActive ? "text-foreground" : "text-muted-foreground"
                  } bg-transparent rounded-md`}
                >
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
                          className={cn(
                            `${
                              isActive
                                ? "text-foreground"
                                : "text-muted-foreground"
                            } hover:bg-transparent focus:bg-transparent`
                          )}
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
              <NavigationMenuItem key={item.title} asChild>
                <Link
                  href={{ pathname: item.href }}
                  className={`${navigationMenuTriggerStyle()} bg-transparent ${
                    isActive ? "text-foreground" : "text-muted-foreground"
                  } ${cn(`hover:bg-transparent focus:bg-transparent`)}`}
                >
                  {item.title}
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
              "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground bg-transparent",
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

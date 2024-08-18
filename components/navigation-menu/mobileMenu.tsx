"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
// utils
import { cn } from "@/lib/utils";
// components libs
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "../ui/drawer";
// components
import Logo from "../own-brand/logo";
import BurgerMenu from "@/components/partials/burgerMenu";
import { INaviagationConfig } from "@/configs/navigation";
import { useParams } from "next/navigation";
import { usePathname } from "@/lib/navigation";
import {
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "../ui/navigation-menu";
import { Accordion, AccordionContent, AccordionTrigger } from "../ui/accordion";
import { AccordionItem } from "@radix-ui/react-accordion";

interface Props {
  navConfig: INaviagationConfig[];
}

const MobileMenu = ({ navConfig }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { slug } = useParams<{ slug: string; locale: string }>();
  const [openItem, setOpenItem] = useState<string>("");

  // Use useEffect to set openItem based on pathname
  useEffect(() => {
    navConfig.forEach((item) => {
      if (item.children && item.children.length) {
        const isActive = pathname.startsWith(item.href);
        if (isActive) {
          setOpenItem(item.title);
        }
      }
    });
  }, [pathname, navConfig]);

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen} direction="right">
      <DrawerTrigger asChild>
        <BurgerMenu onOpen={(status) => setIsOpen(!status)} isOpen={isOpen} />
      </DrawerTrigger>
      <DrawerContent className="focus:outline-none h-screen top-0 right-0 left-auto mt-0 min-w-[300px] rounded-none z-[1000000]">
        <DrawerClose className="absolute right-3 top-3 scale-50">
          <BurgerMenu onOpen={(status) => setIsOpen(!status)} isOpen={isOpen} />
        </DrawerClose>
        <DrawerHeader>
          <DrawerTitle>
            <Link
              className={cn(
                "select-none flex justify-center border-t border-b py-3"
              )}
              href="/"
            >
              <Logo />
            </Link>
          </DrawerTitle>
          <DrawerDescription></DrawerDescription>
          <Accordion
            value={openItem}
            onValueChange={(value) => setOpenItem(value)}
            className="flex flex-col"
            collapsible
            type="single"
          >
            {navConfig.map((item, index) => {
              if (item.children && item.children.length) {
                return (
                  <AccordionItem
                    className="border-b"
                    key={index}
                    value={item.title}
                  >
                    <AccordionTrigger>{item.title}</AccordionTrigger>
                    <AccordionContent className="flex flex-col">
                      {item.children.map((itemCh) => {
                        const concatHref = item.href + itemCh.href;
                        const isActive = pathname.startsWith(concatHref);
                        return (
                          <Link
                            className={`${navigationMenuTriggerStyle()} ${
                              isActive
                                ? "text-foreground"
                                : "text-muted-foreground"
                            } ${cn(
                              `hover:bg-transparent focus:bg-transparent`
                            )}`}
                            href={concatHref}
                            key={concatHref}
                          >
                            {itemCh.title}
                          </Link>
                        );
                      })}
                    </AccordionContent>
                  </AccordionItem>
                );
              } else {
                const isActive =
                  pathname === item.href || pathname === `${item.href}/${slug}`;
                return (
                  <Link
                    key={index}
                    className={`${navigationMenuTriggerStyle()} ${
                      isActive ? "text-foreground" : "text-muted-foreground"
                    } ${cn(
                      `hover:bg-transparent focus:bg-transparent border-b`
                    )}`}
                    href={item.href}
                  >
                    {item.title}
                  </Link>
                );
              }
            })}
          </Accordion>
        </DrawerHeader>
      </DrawerContent>
    </Drawer>
  );
};

export default MobileMenu;

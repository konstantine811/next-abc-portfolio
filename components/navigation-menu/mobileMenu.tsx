"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { usePathname } from "@/lib/navigation";
// utils
import { cn } from "@/lib/utils";
import { navigationMenuTriggerStyle } from "../ui/navigation-menu";
// components libs
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "../ui/drawer";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
// components
import Logo from "../own-brand/logo";
import BurgerMenu from "@/components/partials/burgerMenu";
// configs
import { INaviagationConfig } from "@/configs/navigation";

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
                  <AccordionItem key={index} value={item.title}>
                    <AccordionTrigger>{item.title}</AccordionTrigger>
                    <AccordionContent className="flex flex-col">
                      {item.children.map((itemCh) => {
                        const concatHref = item.href + itemCh.href;
                        const isActive = pathname.startsWith(concatHref);
                        return (
                          <Link
                            className={`${navigationMenuTriggerStyle()} ${
                              isActive
                                ? "text-foreground focus:text-foreground"
                                : "text-muted-foreground focus:text-muted-foreground"
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
                      isActive
                        ? "text-foreground focus:text-foreground"
                        : "text-muted-foreground focus:text-muted-foreground"
                    } ${cn(
                      `hover:bg-transparent  focus:bg-transparent border-b`
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

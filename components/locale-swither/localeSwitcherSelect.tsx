"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LOCALES } from "@/configs/locale";
import { usePathname, useRouter } from "@/i18n/routing";

import { cn } from "@/lib/utils";
import { useLocale } from "next-intl";
import { useParams } from "next/navigation";
import { useState, useTransition } from "react";

const LocaleSwitcherSelect = () => {
  const locale = useLocale();
  const router = useRouter();
  const [, startTransition] = useTransition();
  const pathname = usePathname();
  const params = useParams();
  const [lang] = useState(locale);
  function onSelectChange(lang: string) {
    startTransition(() => {
      router.replace(
        // @ts-expect-error -- TypeScript will validate that only known `params`
        // are used in combination with a given `pathname`. Since the two will
        // always match for the current route, we can skip runtime checks.
        { pathname, params },
        { locale: lang }
      );
    });
  }
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className={cn("h-7 rounded-xl")} variant="outline">
            {lang}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="min-w-[6rem]">
          <DropdownMenuRadioGroup value={lang} onValueChange={onSelectChange}>
            {LOCALES.map((lang) => {
              return (
                <DropdownMenuRadioItem key={lang} value={lang}>
                  {lang.toUpperCase()}
                </DropdownMenuRadioItem>
              );
            })}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default LocaleSwitcherSelect;

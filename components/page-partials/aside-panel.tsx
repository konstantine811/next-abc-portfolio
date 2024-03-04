"use client";

import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { usePathname } from "@/lib/navigation";
import Link from "next/link";
// components
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "../ui/button";
// storage
import { useAppSelector } from "@/lib/store/hooks";
// models
import { BlogPostEntity } from "@/@types/schema.notion";
// configs
import { PATH_ROUTE_NAME } from "@/configs/navigation";

type Prop = {
  className?: string;
  data: BlogPostEntity;
};

const AsidePanel = ({ className, data }: Prop) => {
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const headerHeight = useAppSelector(
    (state) => state.uiStateReducer.value.headerHeight
  );

  function getPathName(id: number) {
    return `${PATH_ROUTE_NAME.blog}/${id}`;
  }
  useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) {
    return;
  }
  return (
    <div className={cn(`${className}`)}>
      <div
        style={{
          top: `${headerHeight}px`,
          height: `calc(100vh - ${headerHeight}px)`,
        }}
        className={cn("sticky py-8  overflow-auto")}
      >
        <Accordion
          type="multiple"
          className="w-full"
          defaultValue={Object.keys(data).map((i) => i)}
        >
          {Object.entries(data).map(([key, items]) => {
            return (
              <AccordionItem key={key} value={key}>
                <AccordionTrigger>{key}</AccordionTrigger>
                <AccordionContent>
                  {items?.map((post) => {
                    return (
                      <Button
                        className={cn(
                          `${
                            pathname === getPathName(post.id)
                              ? "!text-foreground"
                              : ""
                          } whitespace-normal mb-1 last:mb-0 text-muted-foreground`
                        )}
                        key={post.id}
                        asChild
                        variant={"link"}
                      >
                        <Link href={getPathName(post.id)}> {post.title}</Link>
                      </Button>
                    );
                  })}
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </div>
    </div>
  );
};

export default AsidePanel;

"use client";

import { cn } from "@/lib/utils";
import { CSSProperties, useEffect, useState } from "react";
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
import { Separator } from "../ui/separator";
// storage
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
// models
import { BlogPostEntity } from "@/@types/schema.notion";
// configs
import { getPathName } from "@/utils/blog-path";
import CategoryTabWrap from "./blog/categoryTabWrap";
import { onFilteredBlogPost } from "@/lib/store/features/blog-post-state.slice";
import { DEVICE_SIZES } from "@/configs/responsive";

type Prop = {
  className?: string;
  data: BlogPostEntity;
  style: CSSProperties;
};

const AsidePanel = ({ className, data, style }: Prop) => {
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const { headerHeight, screenWidth } = useAppSelector(
    (state) => state.uiStateReducer
  );
  const [selectedPost, setSelectedPost] = useState<BlogPostEntity>({});

  const dispatch = useAppDispatch();
  useEffect(() => {
    setSelectedPost(data);
    dispatch(onFilteredBlogPost(data));
  }, [data, dispatch]);

  useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) {
    return;
  }

  return (
    <>
      {screenWidth >= DEVICE_SIZES.DESKTOP && (
        <div style={style} className={cn(`${className}`)}>
          <div
            style={{
              top: `${headerHeight}px`,
              height: `calc(100vh - ${headerHeight}px)`,
            }}
            className={cn("stick py-8  overflow-auto border-r")}
          >
            <CategoryTabWrap
              selectedPost={(data) => {
                setSelectedPost(data);
                dispatch(onFilteredBlogPost(data));
              }}
              data={data}
            />
            <Separator />
            <Accordion
              type="multiple"
              className="w-full pr-1"
              defaultValue={Object.keys(selectedPost).map((i) => i)}
            >
              {Object.entries(selectedPost).map(([key, items]) => {
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
                                  ? "!text-foreground underline"
                                  : ""
                              } whitespace-normal mb-1 last:mb-0 text-muted-foreground block`
                            )}
                            key={post.id}
                            asChild
                            variant={"link"}
                          >
                            <Link
                              className="!h-auto !py-1"
                              href={getPathName(post.id)}
                            >
                              {" "}
                              {post.title}
                            </Link>
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
      )}
    </>
  );
};

export default AsidePanel;

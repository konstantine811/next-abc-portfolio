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
import { Separator } from "../ui/separator";
// storage
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
// models
import { BlogPostEntity } from "@/@types/schema.notion";
// configs
import { getPathName } from "@/utils/blog-path";
import CategoryTabWrap from "./blog/categoryTabWrap";
import { onFilteredBlogPost } from "@/lib/store/features/blog-post-state.slice";

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
    <div className={cn(`${className}`)}>
      <div
        style={{
          top: `${headerHeight}px`,
          height: `calc(100vh - ${headerHeight}px)`,
        }}
        className={cn("sticky py-8  overflow-auto")}
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
          className="w-full"
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

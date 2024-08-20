"use client";
import { cn } from "@/lib/utils";
import { CSSProperties, useEffect, useRef, useState } from "react";
import { usePathname } from "@/lib/navigation";
import Link from "next/link";
import { motion, Variants } from "framer-motion";
// components
import { ArrowBigLeft } from "lucide-react";
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
import { onFilteredBlogPost } from "@/lib/store/features/blog-post-state.slice";
// models
import { BlogPostEntity } from "@/@types/schema.notion";
// configs
import { getPathName } from "@/utils/blog-path";
import CategoryTabWrap from "./blog/categoryTabWrap";
import { DEVICE_SIZES } from "@/configs/responsive";
import { EASING_ANIMATION } from "@/configs/animations";

type Prop = {
  className?: string;
  data: BlogPostEntity;
  style: CSSProperties;
};

const sidePanelVariants = {
  hidden: {
    x: "-100%",
  },
  visible: {
    x: 0,
    transition: {
      duration: 0.3,
      ease: EASING_ANIMATION.easeOutExpo,
    },
  },
};

const buttonOpenVariants: Variants = {
  open: {
    scale: 1,
  },
  close: {
    scale: -1,
    transition: {
      duration: 0.6,
      ease: EASING_ANIMATION.easeOutExpo,
    },
  },
};

const AsidePanel = ({ className, data, style }: Prop) => {
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const { headerHeight, screenWidth } = useAppSelector(
    (state) => state.uiStateReducer
  );
  const btnRef = useRef<HTMLButtonElement>(null);
  const [btnWidth, setBtnWidth] = useState(0);
  const [selectedPost, setSelectedPost] = useState<BlogPostEntity>({});

  const dispatch = useAppDispatch();
  useEffect(() => {
    setSelectedPost(data);
    dispatch(onFilteredBlogPost(data));
  }, [data, dispatch]);

  sidePanelVariants.hidden.x =
    screenWidth < DEVICE_SIZES.DESKTOP ? "-100%" : "0";

  useEffect(() => {
    setTimeout(() => {
      if (btnRef.current)
        setBtnWidth(btnRef.current.getBoundingClientRect().width);
    }, 120);
  }, [btnRef]);

  useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) {
    return;
  }

  return (
    <div style={style} className={cn(`${className}`)}>
      <motion.div
        style={{
          top: `${headerHeight}px`,
          height: `calc(100vh - ${headerHeight}px)`,
        }}
        className={cn(
          "bg-background/55 backdrop-blur-sm min-w-[300px] xl:min-w-full fixed left-0 xl:sticky py-8  xl:overflow-auto border-r"
        )}
        initial="hidden"
        animate={isOpen ? "visible" : "hidden"}
        variants={sidePanelVariants}
      >
        {screenWidth < DEVICE_SIZES.DESKTOP && (
          <Button
            ref={btnRef}
            variant="outline"
            className="absolute top-5"
            style={{
              right: `-${btnWidth}px`,
            }}
            onClick={() => setIsOpen(!isOpen)}
          >
            <motion.span
              initial="open"
              animate={isOpen ? "open" : "close"}
              variants={buttonOpenVariants}
            >
              <ArrowBigLeft size={24} />
            </motion.span>
          </Button>
        )}
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
          className="w-full xl:pr-1"
          defaultValue={Object.keys(selectedPost).map((i) => i)}
        >
          {Object.entries(selectedPost).map(([key, items]) => {
            return (
              <AccordionItem className="px-5 xl:px-2" key={key} value={key}>
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
      </motion.div>
    </div>
  );
};

export default AsidePanel;

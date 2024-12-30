"use client";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ChevronsLeftIcon } from "lucide-react";
// models
import { BLogPostPage } from "@/@types/schema.notion";
// util helpers
import { cn } from "@/lib/utils";
// componetns
import NotionSwitchParse from "./notion-parse/notionSwitchParse";
import { useLocale } from "next-intl";

import { useEffect } from "react";
import { PATH_ROUTE_NAME } from "@/configs/navigation";
import { useRouter } from "@/i18n/routing";
import Particles from "@/components/ui/particles";
import { TextShimmer } from "@/components/ui/text-shimmer";
import { TextEffect } from "@/components/ui/text-effect";
import useSound from "use-sound";
import { useAppSelector } from "@/lib/store/hooks";
import { RootState } from "@/lib/store/store";

interface Props {
  data: BLogPostPage;
}

const blurSlideVariants = {
  container: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
    exit: {
      transition: { staggerChildren: 0.1, staggerDirection: 1 },
    },
  },
  item: {
    hidden: {
      opacity: 0,
      filter: "blur(3px) brightness(0%)",
      y: 0,
    },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px) brightness(100%)",
      transition: {
        duration: 2.4,
      },
    },
    exit: {
      opacity: 0,
      y: -30,
      filter: "blur(3px) brightness(0%)",
      transition: {
        duration: 2.4,
      },
    },
  },
};

const PostBlog = ({ data: { page, post } }: Props) => {
  const router = useRouter();
  const locale = useLocale();
  const [play, { stop }] = useSound("/sounds/whoosh3.wav", {
    volume: 0.1,
    forceSoundEnabled: true,
    sprite: {
      first: [100, 15000],
    },
  });
  const { isSfxEnabled } = useAppSelector(
    (state: RootState) => state.uiStateReducer
  );
  useEffect(() => {
    if (isSfxEnabled) {
      play({ id: "first" });
    }
    return () => stop();
  }, [play, isSfxEnabled]);
  useEffect(() => {
    if (page.lang !== locale && page.langLink) {
      router.replace(`${PATH_ROUTE_NAME.blog}/${page.langLink}`);
    }
  }, [page, locale, router]);
  return (
    <>
      {page?.cover ? (
        <div className="h-[30vh] relative w-full">
          <Image
            fill
            className="object-cover"
            src={page.cover}
            alt={page.title}
            sizes="(max-width: 768px) 100vw, 
            (max-width: 1200px) 50vw, 
            33vw"
            priority
          />
        </div>
      ) : (
        ""
      )}

      <div className={cn("flex gap-4 items-center w-full grow relative")}>
        <Button
          className={cn("absolute left-0 max-md:-top-5")}
          onClick={() => router.back()}
          variant="outline"
          size="icon"
        >
          <ChevronsLeftIcon className="h-4 w-4" />
        </Button>
        <div
          className={cn(
            `${
              !page?.cover && "min-h-[300px]"
            } relative flex h-full  w-full flex-col items-center justify-center overflow-hidden rounded-lg backdrop-blur-md bg-background/5`
          )}
        >
          <h1 className="text-center text-5xl font-bold md:px-10 px-0 py-5">
            <TextEffect per="char" preset="fade" variants={blurSlideVariants}>
              {page?.title}
            </TextEffect>
          </h1>

          {!page?.cover && (
            <Particles
              className="absolute blur-[1px] inset-0 z-0"
              quantity={100}
              ease={1.7}
              color={"#fff"}
              refresh
            />
          )}
        </div>
      </div>
      <NotionSwitchParse post={post} />
    </>
  );
};

export default PostBlog;

"use client";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ChevronsLeftIcon } from "lucide-react";
// models
import { BLogPostPage } from "@/@types/schema.notion";
// util helpers
import { useRouter } from "@/lib/navigation";
import { cn } from "@/lib/utils";
// componetns
import NotionSwitchParse from "./notion-parse/notionSwitchParse";

interface Props {
  data: BLogPostPage;
}

const PostBlog = ({ data: { page, post } }: Props) => {
  const router = useRouter();
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
        <h1 className="grow text-center text-5xl font-bold md:px-10 px-0 py-5">
          {page?.title}
        </h1>
      </div>
      <NotionSwitchParse post={post} />
    </>
  );
};

export default PostBlog;

"use client";
import {
  BlockObjectResponse,
  BulletedListItemBlockObjectResponse,
} from "@notionhq/client/build/src/api-endpoints";
import { useRouter } from "@/lib/navigation";
import { Button } from "@/components/ui/button";
import { ChevronsLeftIcon } from "lucide-react";
import { BLogPostPage } from "@/@types/schema.notion";
import Image from "next/image";
import { cn } from "@/lib/utils";

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
          />
        </div>
      ) : (
        ""
      )}

      <div className={cn("flex gap-4 items-center w-full grow relative")}>
        <Button
          className={cn("absolute left-0")}
          onClick={() => router.back()}
          variant="outline"
          size="icon"
        >
          <ChevronsLeftIcon className="h-4 w-4" />
        </Button>
        <h1 className="grow text-center text-4xl px-10">{page.title}</h1>
      </div>
      {post.map((item: BlockObjectResponse) => {
        switch (item.type) {
          case "bulleted_list_item":
            console.log(item as BulletedListItemBlockObjectResponse);
        }
      })}
    </>
  );
};

export default PostBlog;

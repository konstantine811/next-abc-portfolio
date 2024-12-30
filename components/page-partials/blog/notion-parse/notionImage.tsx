"use client";

import { BlockObjectChild } from "@/@types/schema.notion";
import { Badge } from "@/components/ui/badge";
import { TextScramble } from "@/components/ui/text-scramble";
import { ImageBlockObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import { useState } from "react";
import { motion } from "framer-motion";
import ResizableImage from "@/components/partials/resizabelImage";

interface Props {
  item: ImageBlockObjectResponse & BlockObjectChild;
}

const NotionImage = ({ item }: Props) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const captionTitle = item.image.caption.map((i) => i.plain_text).join(" ");
  return (
    <div className="m-auto w-full relative md:h-72 h-32  my-3">
      {captionTitle && (
        <div className="relative mt-10 flex justify-center">
          <Badge className="absolute-top-5 shadow-sm" variant="destructive">
            {captionTitle}
          </Badge>
        </div>
      )}
      {!isLoaded && (
        <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center">
          <TextScramble className="font-mono text-sm uppercase">
            {captionTitle === "" ? "Load Notion Image" : captionTitle}
          </TextScramble>
        </div>
      )}

      <ResizableImage>
        <motion.img
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          src={
            item.image.type === "external"
              ? item.image.external.url
              : item.image.file.url
          }
          onLoad={() => setIsLoaded(true)}
          alt={captionTitle === "" ? "Notion Image" : captionTitle}
          className="rounded-2xl h-full overflow-hidden text-white object-contain"
        />
      </ResizableImage>
    </div>
  );
};

export default NotionImage;

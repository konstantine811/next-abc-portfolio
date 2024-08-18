import { BlockObjectChild } from "@/@types/schema.notion";
import { Badge } from "@/components/ui/badge";
import { ImageBlockObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import Image from "next/image";

interface Props {
  item: ImageBlockObjectResponse & BlockObjectChild;
}

const NotionImage = ({ item }: Props) => {
  const captionTitle = item.image.caption.map((i) => i.plain_text).join(" ");
  return (
    <div className="m-auto w-full relative md:h-72 h-32  my-3">
      {captionTitle && (
        <div className="relative mt-10 flex justify-center">
          <Badge
            className="absolute shadow-gray-600 -top-5 shadow-sm"
            variant="outline"
          >
            {captionTitle}
          </Badge>
        </div>
      )}
      {(() => {
        switch (item.image.type) {
          case "external":
            return (
              <Image
                fill
                src={item.image.external.url}
                alt={captionTitle}
                className="rounded-2xl object-contain border overflow-hidden"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                priority
              />
            );
          case "file":
            return (
              <Image
                fill
                src={item.image.file.url}
                alt={captionTitle}
                className="rounded-2xl object-contain border overflow-hidden"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                priority
              />
            );
        }
      })()}
    </div>
  );
};

export default NotionImage;

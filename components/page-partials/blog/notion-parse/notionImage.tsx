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
    <div className="m-auto w-full relative h-72 max-w-lg">
      {captionTitle && (
        <div className="relative">
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
                className="rounded-sm object-cover"
                sizes="(max-width: 768px) 100vw, 
                (max-width: 1200px) 50vw, 
                33vw"
                priority
              />
            );
          case "file":
            return (
              <Image
                fill
                src={item.image.file.url}
                alt={captionTitle}
                className="rounded-sm object-cover"
                sizes="(max-width: 768px) 100vw, 
                (max-width: 1200px) 50vw, 
                33vw"
                priority
              />
            );
        }
      })()}
    </div>
  );
};

export default NotionImage;

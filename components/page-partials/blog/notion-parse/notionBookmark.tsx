import axios from "axios";
import { Link } from "@/i18n/routing";
import { useEffect, useState } from "react";
// models
import { BlockObjectChild } from "@/@types/schema.notion";
import { IMetadata } from "@/models/server-data/metadata";
// configs
import { API_PATH } from "@/configs/api";
import { BookmarkBlockObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import { LucideLink } from "lucide-react";

interface Prop {
  item: BookmarkBlockObjectResponse & BlockObjectChild;
}

const NotionBookmark = ({ item }: Prop) => {
  const [metadata, setMetadata] = useState<IMetadata>();

  useEffect(() => {
    axios<IMetadata>(API_PATH.metaData(item.bookmark.url))
      .then((data) => {
        setMetadata(data.data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [item.bookmark.url]);
  return (
    <>
      {metadata && (
        <div
          onClick={() => window.open(metadata.url, "_blank")}
          className="mt-2 cursor-pointer"
        >
          <Card className="flex justify-between" x-chunk="dashboard-05-chunk-0">
            <div>
              <CardHeader className="pb-3">
                <CardTitle>{metadata?.title}</CardTitle>
                <CardDescription className="max-w-lg text-balance leading-relaxed">
                  {metadata?.description}
                </CardDescription>
              </CardHeader>
              <CardFooter>
                <LucideLink className="h-3" />
                <Link href={metadata.url}>{metadata.url}</Link>
              </CardFooter>
            </div>
            <div className="relative w-1/2">
              <Image
                fill
                src={metadata.image}
                alt={metadata.title}
                priority
                className="object-cover"
              />
            </div>
          </Card>
        </div>
      )}
    </>
  );
};

export default NotionBookmark;

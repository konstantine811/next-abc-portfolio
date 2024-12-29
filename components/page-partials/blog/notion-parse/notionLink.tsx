"use client";

import { PATH_ROUTE_NAME } from "@/configs/navigation";
import { cn } from "@/lib/utils";
import { RichTextItemResponse } from "@notionhq/client/build/src/api-endpoints";
import { Link } from "@/i18n/routing";
import { useParams } from "next/navigation";

interface Prop {
  data: RichTextItemResponse;
  className?: string;
}

function checkTransformLink(slug: string, link: string) {
  // Removing hyphens from the substring
  const normalizedSubstring = slug.replace(/-/g, "");
  // Checking if the main string contains the normalized substring
  const containsSubstring = link.includes(normalizedSubstring);
  if (containsSubstring) {
    const idSymbol = "#";
    return `${idSymbol}${link.split(idSymbol)[1]}`;
  }
  return `${PATH_ROUTE_NAME.blog}/${link}`;
}

const NotionLink = ({ data, className }: Prop) => {
  const { slug } = useParams<{ slug: string; locale: string }>();
  return (
    <Link
      className={cn(`text-muted-foreground underline ${className}`)}
      href={checkTransformLink(slug, data.href ? data.href : "")}
    >
      {data.plain_text}
    </Link>
  );
};

export default NotionLink;

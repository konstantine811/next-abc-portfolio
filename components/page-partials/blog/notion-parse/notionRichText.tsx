"use client";

import { RichTextItemResponse } from "@notionhq/client/build/src/api-endpoints";
import TextWrapper from "@/components/wrapper/text-wrapper";
import { ElementType } from "react";
import { NotionTextColor } from "@/@types/schema.notion";
import { Link } from "@/i18n/routing";
import { TextShimmer } from "@/components/ui/text-shimmer";
import { TextScramble } from "@/components/ui/text-scramble";
import { cn } from "@/lib/utils";
import { getPathName } from "@/utils/blog.utils";

interface NotionRichTextProps {
  rich_text: RichTextItemResponse[];
  color: string;
  as: ElementType;
  className?: string;
  typeAnimation?: "shimmer" | "scramble" | "particle-bg";
}

const NotionRichText = ({
  rich_text,
  color,
  as,
  className,
  typeAnimation,
}: NotionRichTextProps) => {
  const additioanlBgClass = "text-white rounded-md py-0.5 px-2";
  function getColorByType(color: NotionTextColor) {
    switch (color) {
      case "gray":
        return "text-gray-500";
      case "brown":
        return "text-brown-500";
      case "orange":
        return "text-orange-500";
      case "yellow":
        return "text-yellow-500";
      case "green":
        return "text-green-500";
      case "blue":
        return "text-blue-500";
      case "purple":
        return "text-purple-500";
      case "pink":
        return "text-pink-500";
      case "red":
        return "text-red-500";
      case "gray_background":
        return `bg-gray-500 border border-gray-400 ${additioanlBgClass}`;
      case "brown_background":
        return `bg-red-500 border border-red-400 ${additioanlBgClass}`;
      case "orange_background":
        return `bg-orange-500 border border-orange-400 ${additioanlBgClass}`;
      case "yellow_background":
        return `bg-yellow-500 border border-yellow-400 ${additioanlBgClass}`;
      case "green_background":
        return `bg-green-500 border border-green-400 ${additioanlBgClass}`;
      case "blue_background":
        return `bg-indigo-600 border border-indigo-400 ${additioanlBgClass}`;
      case "purple_background":
        return `bg-purple-400 border border-purple-500 ${additioanlBgClass}`;
      case "pink_background":
        return `bg-pink-500 border border-pink-400 ${additioanlBgClass}`;
      case "red_background":
        return `bg-red-500 border border-red-400 ${additioanlBgClass}`;
      default:
        return "";
    }
  }
  return (
    <TextWrapper className={className} as={as}>
      {rich_text.map((item, index) => {
        return item.href ? (
          <Link
            className={`${
              item.annotations.bold ? "font-bold" : ""
            } ${getColorByType(
              item.annotations.color as any
            )} underline underline-offset-4`}
            key={index}
            href={
              item.href.startsWith("http") ? item.href : getPathName(item.href)
            }
            target={item.href.startsWith("http") ? "_blank" : "_self"}
          >
            {item.plain_text}
          </Link>
        ) : (
          <span
            className={`${cn(
              `${item.annotations.bold ? "font-bold" : ""} ${getColorByType(
                item.annotations.color as any
              )} ${
                item.annotations.code &&
                "bg-indigo-500 border border-indigo-700 text-white font-bold px-2 rounded-lg py-0.5"
              }`
            )}`}
            key={index}
          >
            {(() => {
              switch (typeAnimation) {
                case "shimmer":
                  return (
                    <TextShimmer spread={3} duration={3}>
                      {item.plain_text}
                    </TextShimmer>
                  );
                case "scramble":
                  return (
                    <TextScramble
                      className="font-mono text-sm"
                      duration={2.2}
                      characterSet=". "
                    >
                      {item.plain_text}
                    </TextScramble>
                  );
                default:
                  return item.plain_text;
              }
            })()}
          </span>
        );
      })}
    </TextWrapper>
  );
};

export default NotionRichText;

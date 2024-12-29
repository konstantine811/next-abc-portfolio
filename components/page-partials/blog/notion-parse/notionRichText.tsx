"use client";

import { RichTextItemResponse } from "@notionhq/client/build/src/api-endpoints";
import TextWrapper from "@/components/wrapper/text-wrapper";
import { ElementType } from "react";
import { NotionTextColor } from "@/@types/schema.notion";
import Link from "next/link";
import { TextShimmer } from "@/components/ui/text-shimmer";
import { TextScramble } from "@/components/ui/text-scramble";

interface NotionRichTextProps {
  rich_text: RichTextItemResponse[];
  color: string;
  as: ElementType;
  className?: string;
  typeAnimation?: "shimmer" | "scramble";
}

const NotionRichText = ({
  rich_text,
  color,
  as,
  className,
  typeAnimation,
}: NotionRichTextProps) => {
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
        return "bg-gray-500 text-white px-1 rounded-sm";
      case "brown_background":
        return "bg-orange-950 text-white px-1 rounded-sm";
      case "orange_background":
        return "bg-orange-500 text-white px-1 rounded-sm";
      case "yellow_background":
        return "bg-yellow-500 text-white px-1 rounded-sm";
      case "green_background":
        return "bg-green-500 text-white px-1 rounded-sm";
      case "blue_background":
        return "bg-blue-500 text-white px-1 rounded-sm";
      case "purple_background":
        return "bg-purple-500 text-white px-1 rounded-sm";
      case "pink_background":
        return "bg-pink-500 text-white px-1 rounded-sm";
      case "red_background":
        return "bg-red-500 text-white px-1 rounded-sm";
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
              item.annotations.color
            )} underline underline-offset-4`}
            key={index}
            href={item.href}
          >
            {" "}
            {item.plain_text}
          </Link>
        ) : (
          <span
            className={`${
              item.annotations.bold ? "font-bold" : ""
            } ${getColorByType(item.annotations.color)}`}
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

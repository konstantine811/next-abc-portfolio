"use client";

import { RichTextItemResponse } from "@notionhq/client/build/src/api-endpoints";
import TextWrapper from "@/components/wrapper/text-wrapper";
import { ElementType } from "react";
import { NotionTextColor } from "@/@types/schema.notion";
import { Link } from "@/i18n/routing";
import { TextShimmer } from "@/components/ui/text-shimmer";
import { TextScramble } from "@/components/ui/text-scramble";
import Particles from "@/components/ui/particles";

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
        return "bg-gray-500 border border-gray-400 text-white px-1 rounded-lg p-1";
      case "brown_background":
        return "bg-red-500 border border-red-400 text-white px-1 rounded-lg p-1";
      case "orange_background":
        return "bg-ore-500 text-white px-1 rounded-lg p-1";
      case "yellow_background":
        return "bg-yellow-500 text-white px-1 rounded-lg p-1";
      case "green_background":
        return "bg-green-500 text-white px-1 rounded-lg p-1";
      case "blue_background":
        return "bg-blue-500 text-white px-1 rounded-lg p-1";
      case "purple_background":
        return "bg-purple-400 border border-purple-500 text-white px-1 rounded-lg p-1";
      case "pink_background":
        return "bg-pink-500 text-white px-1 rounded-lg p-1";
      case "red_background":
        return "bg-red-500 text-white px-1 rounded-lg p-1";
      default:
        return "";
    }
  }
  console.log("data", rich_text);
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
            {item.plain_text}
          </Link>
        ) : (
          <span
            className={`${
              item.annotations.bold ? "font-bold" : ""
            } ${getColorByType(item.annotations.color)} ${
              item.annotations.code &&
              "bg-indigo-500 border border-indigo-700 text-white font-bold px-2 rounded-lg py-0.5"
            }`}
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
                case "particle-bg":
                  <div className="relative flex h-[500px] w-full flex-col items-center justify-center overflow-hidden rounded-lg border bg-background md:shadow-xl">
                    <span className="pointer-events-none z-10 whitespace-pre-wrap text-center text-8xl font-semibold leading-none">
                      {item.plain_text}
                    </span>
                    <Particles
                      className="absolute inset-0 z-0"
                      quantity={100}
                      ease={80}
                      color={color}
                      refresh
                    />
                  </div>;
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

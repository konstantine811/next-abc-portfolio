"use client";

// compoents
import NotionBulletListItem from "./notionBulletListItem";
import {
  BlockObjectChild,
  BlockObjectChildResponse,
} from "@/@types/schema.notion";
import NotionRichText from "./notionRichText";
import NotionQuote from "./notionQuote";
import NotionCode from "./notionCode";
import NotionImage from "./notionImage";
import NotionTable from "./notionTable";
import NotionParseItem from "./notionNumberList";
import { NumberedListItemBlockObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import NotionBookmark from "./notionBookmark";
import { useState } from "react";
import { motion } from "framer-motion";
import NotionVideo from "./notionVideo";

interface Prop {
  post: BlockObjectChildResponse[];
  level?: number;
}

const NotionSwitchParse = ({ post, level }: Prop) => {
  const [copiedCode, setCopiedCode] = useState("");
  const numberCacheList: (NumberedListItemBlockObjectResponse &
    BlockObjectChild)[] = [];
  return (
    <div className={`${level ? "" : "pb-20"}`}>
      {post?.map((item: BlockObjectChildResponse, index) => {
        return (
          <motion.div
            key={index}
            initial={{ opacity: 0.39, y: -5, filter: "blur(0.13px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.9, ease: "easeInOut" }}
            viewport={{ margin: "-100px 0px 100px 0px" }}
          >
            {(() => {
              switch (item.type) {
                case "bulleted_list_item":
                  return (
                    <NotionBulletListItem
                      key={item.id}
                      level={level}
                      data={item}
                    />
                  );
                case "paragraph":
                  return (
                    <NotionRichText
                      key={item.id}
                      as={"p"}
                      rich_text={item.paragraph.rich_text}
                      color={item.paragraph.color}
                      className="text-lg py-2"
                    />
                  );
                case "heading_1":
                  return (
                    <NotionRichText
                      key={item.id}
                      as={"h2"}
                      rich_text={item.heading_1.rich_text}
                      color={item.heading_1.color}
                      className="text-4xl font-bold mb-2 md:mt-20 mt-5"
                    />
                  );
                case "heading_2":
                  return (
                    <NotionRichText
                      key={item.id}
                      as={"h3"}
                      rich_text={item.heading_2.rich_text}
                      className="text-3xl font-bold mb-2 md:mt-20 mt-5"
                      color={item.heading_2.color}
                    />
                  );
                case "heading_3":
                  return (
                    <NotionRichText
                      key={item.id}
                      as={"h4"}
                      rich_text={item.heading_3.rich_text}
                      color={item.heading_3.color}
                      className="text-xl font-bold mb-2 md:mt-20 mt-5"
                    />
                  );
                case "quote":
                  return <NotionQuote key={item.id} item={item} />;
                case "code":
                  return (
                    <NotionCode
                      onCopy={() => setCopiedCode(item.id)}
                      isCopied={item.id === copiedCode}
                      item={item}
                      key={item.id}
                    />
                  );
                case "image":
                  return <NotionImage key={item.id} item={item} />;
                case "video":
                  return <NotionVideo key={item.id} items={item} />;
                case "table":
                  return <NotionTable key={item.id} item={item} />;
                case "numbered_list_item":
                  numberCacheList.push(item);
                  // Перевіряємо, чи наступний елемент відмінний від numbered_list_item або закінчився масив
                  if (
                    !post[index + 1] ||
                    post[index + 1].type !== "numbered_list_item"
                  ) {
                    // Копіюємо накопичені елементи для рендерингу
                    const itemsToRender = [...numberCacheList];
                    // Очищаємо кеш для наступної групи
                    numberCacheList.length = 0;
                    return (
                      <NotionParseItem
                        key={item.id}
                        items={itemsToRender}
                        level={level || 0}
                      />
                    );
                  } else {
                    return null;
                  }
                case "divider":
                  return (
                    <hr key={item.id} className="border-t border-gray-600" />
                  );
                case "link_preview":
                  return (
                    <NotionBookmark key={item.id} url={item.link_preview.url} />
                  );
                case "bookmark":
                  return (
                    <NotionBookmark key={item.id} url={item.bookmark.url} />
                  );
                default:
                  console.warn("NotionSwitchParse: Unknown type", item);
                  return null;
              }
            })()}
          </motion.div>
        );
      })}
    </div>
  );
};

export default NotionSwitchParse;

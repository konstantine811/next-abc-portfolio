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

interface Prop {
  post: BlockObjectChildResponse[];
  level?: number;
}

const NotionSwitchParse = ({ post, level }: Prop) => {
  const numberCacheList: (NumberedListItemBlockObjectResponse &
    BlockObjectChild)[] = [];
  return (
    <div className="pb-20">
      {post?.map((item: BlockObjectChildResponse, index) => {
        switch (item.type) {
          case "bulleted_list_item":
            return (
              <NotionBulletListItem key={item.id} level={level} data={item} />
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
                className="text-4xl font-bold mb-2 mt-20"
              />
            );
          case "heading_2":
            return (
              <NotionRichText
                key={item.id}
                as={"h3"}
                rich_text={item.heading_2.rich_text}
                className="text-3xl font-bold mb-2 mt-20"
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
                className="text-xl font-bold mb-2 mt-20"
              />
            );
          case "quote":
            return <NotionQuote key={item.id} item={item} />;
          case "code":
            return <NotionCode key={item.id} item={item} />;
          case "image":
            return <NotionImage key={item.id} item={item} />;
          case "table":
            return <NotionTable key={item.id} item={item} />;
          case "numbered_list_item":
            if (post[index + 1]?.type === "numbered_list_item") {
              numberCacheList.push(item);
              return null;
            } else {
              numberCacheList.push(item);
              return <NotionParseItem key={item.id} items={numberCacheList} />;
            }
          case "divider":
            return <hr key={item.id} className="border-t border-gray-600" />;
          default:
            console.log("NotionSwitchParse: Unknown type", item);
            return null;
        }
      })}
    </div>
  );
};

export default NotionSwitchParse;

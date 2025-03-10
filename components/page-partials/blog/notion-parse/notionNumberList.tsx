"use client";
import { BlockObjectChild } from "@/@types/schema.notion";
import { NumberedListItemBlockObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import NotionRichText from "./notionRichText";
import NotionSwitchParse from "./notionSwitchParse";

interface Props {
  items: (NumberedListItemBlockObjectResponse & BlockObjectChild)[];
  level: number;
}

const NotionParseItem = ({ items, level }: Props) => {
  return (
    <ol className="list-decimal pl-8 py-4">
      {items.map((item, index) => {
        return (
          <li key={index} className="py-1">
            <NotionRichText
              key={item.id}
              as={"span"}
              rich_text={item.numbered_list_item.rich_text}
              color={item.numbered_list_item.color}
            />
            {item.has_children && (
              <NotionSwitchParse post={item.children} level={level + 1} />
            )}
          </li>
        );
      })}
    </ol>
  );
};

export default NotionParseItem;

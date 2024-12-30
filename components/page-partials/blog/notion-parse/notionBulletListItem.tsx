"use client";

// models
import { BulletedListItemBlockObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import { BlockObjectChildResponse } from "@/@types/schema.notion";
// utils function
import { cn } from "@/lib/utils";
// components
import NotionSwitchParse from "./notionSwitchParse";
import NotionText from "./notionText";
import NotionRichText from "./notionRichText";

interface Prop {
  data: BulletedListItemBlockObjectResponse;
  level?: number;
}

const NotionBulletListItem = ({ data, level = 0 }: Prop) => {
  function getCircleLevelClass() {
    switch ((level + 1) % 3) {
      case 1:
        return "before:bg-foreground before:rounded";
      case 2:
        return "before:border before:border before:rounded";
      case 3:
        return "before:bg-foreground";
      default:
        return "before:bg-foreground";
    }
  }
  return (
    <div
      className={cn("flex flex-col gap-2")}
      style={{ marginLeft: `${level * 12}px` }}
    >
      <div
        className={cn(
          `before:w-[6px] before:h-[6px] before:m-[6px] before:inline-block flex items-center ${getCircleLevelClass()}`
        )}
      >
        <NotionRichText
          color={data.bulleted_list_item.color}
          as={"p"}
          rich_text={data.bulleted_list_item.rich_text}
        />
      </div>
      {data.has_children ? (
        <NotionSwitchParse
          level={level + 1}
          post={(data as BlockObjectChildResponse).children}
        />
      ) : (
        ""
      )}
    </div>
  );
};

export default NotionBulletListItem;

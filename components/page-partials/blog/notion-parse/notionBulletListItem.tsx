"use client";

import { BulletedListItemBlockObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import NotionText from "./notionText";
import NotionSwitchParse from "./notionSwitchParse";
import { BlockObjectChildResponse } from "@/@types/schema.notion";
import { cn } from "@/lib/utils";

interface Prop {
  data: BulletedListItemBlockObjectResponse;
  className?: string;
  level?: number;
}

const NotionBulletListItem = ({ data, className, level = 0 }: Prop) => {
  return (
    <div
      className="flex flex-col gap-2"
      style={{ paddingLeft: `${level * 20 * 0.8}px` }}
    >
      <div
        className={cn(
          `before:w-[5px] before:h-[5px] before:bg-white before:inline-block before:rounded flex items-center gap-2 `
        )}
      >
        {data.bulleted_list_item.rich_text.map((item, index) => {
          return <NotionText key={`${data.id}_${index}`} data={item} />;
        })}
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

"use client";

// compoents
import NotionBulletListItem from "./notionBulletListItem";
import { BlockObjectChildResponse } from "@/@types/schema.notion";
import NotionText from "./notionText";
import NotionRichText from "./notionRichText";

interface Prop {
  post: BlockObjectChildResponse[];
  level?: number;
}

const NotionSwitchParse = ({ post, level }: Prop) => {
  console.log("post____", post);
  return (
    <>
      {post?.map((item: BlockObjectChildResponse) => {
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
              />
            );
          case "heading_1":
            return (
              <NotionRichText
                key={item.id}
                as={"h1"}
                rich_text={item.heading_1.rich_text}
                color={item.heading_1.color}
              />
            );
          case "heading_2":
            return (
              <NotionRichText
                key={item.id}
                as={"h2"}
                rich_text={item.heading_2.rich_text}
                color={item.heading_2.color}
              />
            );
          case "heading_3":
            return (
              <NotionRichText
                key={item.id}
                as={"h3"}
                rich_text={item.heading_3.rich_text}
                color={item.heading_3.color}
              />
            );
        }
      })}
    </>
  );
};

export default NotionSwitchParse;
